import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from pathlib import Path
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader


# info

CSV_CANDIDATES = [
    Path("data_for_ws.csv"),
    Path(r"C:/Users/yuliya/Documents/Genius_Finals/public_emdat_custom_request_2026-06-09_8325a9ea-a294-44f8-bbca-fa6cbc590d39.csv"),
]

TRAIN_END_YEAR = 2025
FORECAST_YEARS = 5
VALIDATION_MONTHS = 24

OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(exist_ok=True)


def resolve_csv_path():
    for candidate in CSV_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        "No disaster source CSV was found. Add a local file like data_for_ws.csv or update CSV_CANDIDATES."
    )


# data loading

def load_emdat_data(path):
    df = pd.read_csv(path, encoding="latin1")

    required_cols = ["Start Year", "Start Month", "Disaster Type"]
    region_col = "Region" if "Region" in df.columns else "Subregion" if "Subregion" in df.columns else None

    if not region_col:
        raise ValueError("Missing required geographic column: Region or Subregion")

    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")

    df = df[required_cols + [region_col]].copy()
    df = df.rename(columns={region_col: "Region"})

    df = df.dropna(subset=["Start Year", "Start Month", "Disaster Type", "Region"])

    df["Start Year"] = df["Start Year"].astype(int)
    df["Start Month"] = df["Start Month"].astype(int)
    df["Region"] = df["Region"].astype(str).str.strip()
    df = df[df["Region"] != ""]

    df = df[
        (df["Start Month"] >= 1) &
        (df["Start Month"] <= 12)
    ]

    df["date"] = pd.to_datetime(
        dict(
            year=df["Start Year"],
            month=df["Start Month"],
            day=1
        )
    )

    df = df[df["Start Year"] <= TRAIN_END_YEAR]

    return df


# monthly counts

def create_monthly_counts(df):
    monthly = (
        df.groupby(["date", "Region", "Disaster Type"])
        .size()
        .reset_index(name="count")
    )

    all_dates = pd.date_range(
        monthly["date"].min(),
        monthly["date"].max(),
        freq="MS"
    )

    regions = monthly["Region"].unique()
    disaster_types = monthly["Disaster Type"].unique()

    full_index = pd.MultiIndex.from_product(
        [all_dates, regions, disaster_types],
        names=["date", "Region", "Disaster Type"]
    )

    monthly = (
        monthly
        .set_index(["date", "Region", "Disaster Type"])
        .reindex(full_index, fill_value=0)
        .reset_index()
    )

    monthly["year"] = monthly["date"].dt.year
    monthly["month"] = monthly["date"].dt.month
    monthly["quarter"] = monthly["date"].dt.quarter

    return monthly


# features

def add_time_features(data):
    data = data.sort_values(["Region", "Disaster Type", "date"]).copy()

    grouped = data.groupby(["Region", "Disaster Type"])["count"]

    data["lag_1"] = grouped.shift(1)
    data["lag_2"] = grouped.shift(2)
    data["lag_3"] = grouped.shift(3)
    data["lag_6"] = grouped.shift(6)
    data["lag_12"] = grouped.shift(12)

    data["rolling_mean_3"] = (
        grouped.shift(1)
        .rolling(3)
        .mean()
        .reset_index(level=0, drop=True)
    )

    data["rolling_mean_6"] = (
        grouped.shift(1)
        .rolling(6)
        .mean()
        .reset_index(level=0, drop=True)
    )

    data["rolling_mean_12"] = (
        grouped.shift(1)
        .rolling(12)
        .mean()
        .reset_index(level=0, drop=True)
    )

    # Cyclical month encoding so Dec→Jan wraps correctly
    data["month_sin"] = np.sin(2 * np.pi * data["month"] / 12)
    data["month_cos"] = np.cos(2 * np.pi * data["month"] / 12)

    data = data.dropna()

    return data


# training

class DisasterPredictionModel(nn.Module):
    def __init__(self, input_size):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_size, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Linear(64, 1),
        )

    def forward(self, x):
        return self.net(x)


def train_model(feature_data):
    valid_start = feature_data["date"].max() - pd.DateOffset(months=VALIDATION_MONTHS - 1)

    train_df = feature_data[feature_data["date"] < valid_start]
    valid_df = feature_data[feature_data["date"] >= valid_start]

    feature_cols = [
        "Region",
        "Disaster Type",
        "year",
        "quarter",
        "month_sin",
        "month_cos",
        "lag_1",
        "lag_2",
        "lag_3",
        "lag_6",
        "lag_12",
        "rolling_mean_3",
        "rolling_mean_6",
        "rolling_mean_12",
    ]

    target_col = "count"

    X_train = train_df[feature_cols]
    y_train = train_df[target_col]

    X_valid = valid_df[feature_cols]
    y_valid = valid_df[target_col]

    categorical_features = ["Region", "Disaster Type"]
    numeric_features = [col for col in feature_cols if col not in categorical_features]

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore"),
                categorical_features
            ),
            (
                "num",
                StandardScaler(),
                numeric_features
            )
        ]
    )

    X_train_processed = preprocessor.fit_transform(X_train)
    X_valid_processed = preprocessor.transform(X_valid)

    if hasattr(X_train_processed, 'toarray'):
        X_train_processed = X_train_processed.toarray()
    if hasattr(X_valid_processed, 'toarray'):
        X_valid_processed = X_valid_processed.toarray()

    X_train_tensor = torch.FloatTensor(X_train_processed)
    y_train_tensor = torch.FloatTensor(y_train.values.reshape(-1, 1))
    X_valid_tensor = torch.FloatTensor(X_valid_processed)
    y_valid_tensor = torch.FloatTensor(y_valid.values.reshape(-1, 1))

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    X_train_tensor = X_train_tensor.to(device)
    y_train_tensor = y_train_tensor.to(device)
    X_valid_tensor = X_valid_tensor.to(device)
    y_valid_tensor = y_valid_tensor.to(device)

    train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)

    input_size = X_train_processed.shape[1]
    model = DisasterPredictionModel(input_size).to(device)

    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=10, factor=0.5)

    use_amp = device.type == "cuda"
    scaler = torch.cuda.amp.GradScaler(enabled=use_amp)

    epochs = 300
    patience = 25
    no_improve = 0
    best_val_loss = float("inf")
    best_weights = None

    print("Training neural network on GPU...")
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for X_batch, y_batch in train_loader:
            optimizer.zero_grad()
            with torch.autocast(device_type=device.type, enabled=use_amp):
                outputs = model(X_batch)
                loss = criterion(outputs, y_batch)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            total_loss += loss.item()

        model.eval()
        with torch.no_grad():
            with torch.autocast(device_type=device.type, enabled=use_amp):
                val_preds = model(X_valid_tensor)
                val_loss = criterion(val_preds, y_valid_tensor).item()

        scheduler.step(val_loss)

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            best_weights = {k: v.cpu().clone() for k, v in model.state_dict().items()}
            no_improve = 0
        else:
            no_improve += 1
            if no_improve >= patience:
                print(f"Early stopping at epoch {epoch + 1}")
                break

        if (epoch + 1) % 20 == 0:
            print(f"Epoch {epoch + 1}/{epochs}, Train Loss: {total_loss / len(train_loader):.4f}, Val Loss: {val_loss:.4f}")

    model.load_state_dict({k: v.to(device) for k, v in best_weights.items()})
    torch.save(best_weights, OUTPUT_DIR / "disaster_model.pt")
    print(f"Best model saved to {OUTPUT_DIR / 'disaster_model.pt'}")

    model.eval()
    with torch.no_grad():
        valid_predictions_tensor = model(X_valid_tensor)
        valid_predictions = valid_predictions_tensor.cpu().numpy().flatten()
        valid_predictions = np.maximum(valid_predictions, 0)

    mae = mean_absolute_error(y_valid.values, valid_predictions)
    rmse = np.sqrt(mean_squared_error(y_valid.values, valid_predictions))

    print("\nValidation results (GPU):")
    print(f"MAE:  {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")

    return model, feature_cols, preprocessor, device


# forecasting

def forecast_future(monthly_data, model, feature_cols, preprocessor, device):
    history = monthly_data.copy()
    history = history.sort_values(["Region", "Disaster Type", "date"])

    last_date = history["date"].max()
    future_dates = pd.date_range(
        last_date + pd.DateOffset(months=1),
        periods=FORECAST_YEARS * 12,
        freq="MS"
    )

    region_type_pairs = (
        history[["Region", "Disaster Type"]]
        .drop_duplicates()
        .sort_values(["Region", "Disaster Type"])
        .itertuples(index=False, name=None)
    )
    region_type_pairs = list(region_type_pairs)
    predictions = []

    use_amp = device.type == "cuda"
    model.eval()

    for future_date in future_dates:
        rows = []

        for region, disaster_type in region_type_pairs:
            type_history = history[
                (history["Region"] == region) &
                (history["Disaster Type"] == disaster_type)
            ].sort_values("date")

            counts = type_history["count"].values

            row = {
                "date": future_date,
                "Region": region,
                "Disaster Type": disaster_type,
                "year": future_date.year,
                "month": future_date.month,
                "quarter": future_date.quarter,
                "month_sin": np.sin(2 * np.pi * future_date.month / 12),
                "month_cos": np.cos(2 * np.pi * future_date.month / 12),
                "lag_1": counts[-1] if len(counts) >= 1 else 0,
                "lag_2": counts[-2] if len(counts) >= 2 else 0,
                "lag_3": counts[-3] if len(counts) >= 3 else 0,
                "lag_6": counts[-6] if len(counts) >= 6 else 0,
                "lag_12": counts[-12] if len(counts) >= 12 else 0,
                "rolling_mean_3": np.mean(counts[-3:]) if len(counts) >= 3 else np.mean(counts),
                "rolling_mean_6": np.mean(counts[-6:]) if len(counts) >= 6 else np.mean(counts),
                "rolling_mean_12": np.mean(counts[-12:]) if len(counts) >= 12 else np.mean(counts),
            }

            rows.append(row)

        future_df = pd.DataFrame(rows)

        future_processed = preprocessor.transform(future_df[feature_cols])
        if hasattr(future_processed, 'toarray'):
            future_processed = future_processed.toarray()

        future_tensor = torch.FloatTensor(future_processed).to(device)

        with torch.no_grad():
            with torch.autocast(device_type=device.type, enabled=use_amp):
                predicted_tensor = model(future_tensor)
            predicted_count = predicted_tensor.cpu().float().numpy().flatten()
            predicted_count = np.maximum(predicted_count, 0)

        future_df["predicted_count"] = predicted_count

        predictions.append(future_df.copy())

        add_to_history = future_df[["date", "Region", "Disaster Type", "predicted_count"]].copy()
        add_to_history = add_to_history.rename(columns={"predicted_count": "count"})
        add_to_history["year"] = add_to_history["date"].dt.year
        add_to_history["month"] = add_to_history["date"].dt.month
        add_to_history["quarter"] = add_to_history["date"].dt.quarter

        history = pd.concat([history, add_to_history], ignore_index=True)

    forecast = pd.concat(predictions, ignore_index=True)

    return forecast


# plot results

def plot_overall_trend(monthly_data, forecast):
    historical = (
        monthly_data.groupby("date")["count"]
        .sum()
        .reset_index()
    )

    predicted = (
        forecast.groupby("date")["predicted_count"]
        .sum()
        .reset_index()
    )

    plt.figure(figsize=(12, 6))

    plt.plot(
        historical["date"],
        historical["count"],
        label="Historical disasters"
    )

    plt.plot(
        predicted["date"],
        predicted["predicted_count"],
        label="Predicted disasters"
    )

    plt.title("Natural Disaster Trend Forecast")
    plt.xlabel("Date")
    plt.ylabel("Number of disasters")
    plt.legend()
    plt.grid(True)

    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / "overall_disaster_trend_forecast.png", dpi=300)
    plt.show()


def plot_regional_trend(monthly_data, forecast):
    historical = (
        monthly_data.groupby(["date", "Region"])["count"]
        .sum()
        .reset_index()
    )

    predicted = (
        forecast.groupby(["date", "Region"])["predicted_count"]
        .sum()
        .reset_index()
    )

    plt.figure(figsize=(14, 7))

    for region in sorted(predicted["Region"].unique()):
        regional_history = historical[historical["Region"] == region]
        regional_predicted = predicted[predicted["Region"] == region]

        plt.plot(
            regional_history["date"],
            regional_history["count"],
            alpha=0.22,
            linewidth=1.2,
            label=f"{region} historical"
        )
        plt.plot(
            regional_predicted["date"],
            regional_predicted["predicted_count"],
            linewidth=2.0,
            label=f"{region} forecast"
        )

    plt.title("Regional Natural Disaster Trend Forecast")
    plt.xlabel("Date")
    plt.ylabel("Number of disasters")
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(OUTPUT_DIR / "regional_disaster_trend_forecast.png", dpi=300)
    plt.show()


print("Loading data...")
csv_path = resolve_csv_path()
print(f"Using source file: {csv_path}")
df = load_emdat_data(csv_path)

print("Creating monthly disaster counts...")
monthly = create_monthly_counts(df)

print("Adding ML features...")
feature_data = add_time_features(monthly)

print("Training model on GPU...")
model, feature_cols, preprocessor, device = train_model(feature_data)

print("Forecasting future trends (using GPU)...")
forecast = forecast_future(monthly, model, feature_cols, preprocessor, device)

monthly_forecast_path = OUTPUT_DIR / "monthly_forecast_by_disaster_type.csv"
yearly_forecast_path = OUTPUT_DIR / "yearly_forecast_by_disaster_type.csv"
regional_monthly_forecast_path = OUTPUT_DIR / "monthly_forecast_by_region_and_disaster_type.csv"
regional_yearly_forecast_path = OUTPUT_DIR / "yearly_forecast_by_region_and_disaster_type.csv"

forecast.to_csv(monthly_forecast_path, index=False)
forecast.to_csv(regional_monthly_forecast_path, index=False)

yearly_forecast = (
    forecast
    .groupby(["year", "Disaster Type"])["predicted_count"]
    .sum()
    .reset_index()
)

regional_yearly_forecast = (
    forecast
    .groupby(["year", "Region", "Disaster Type"])["predicted_count"]
    .sum()
    .reset_index()
)

yearly_forecast.to_csv(yearly_forecast_path, index=False)
regional_yearly_forecast.to_csv(regional_yearly_forecast_path, index=False)

print("Saved files:")
print(monthly_forecast_path)
print(yearly_forecast_path)
print(regional_monthly_forecast_path)
print(regional_yearly_forecast_path)

print("Plotting trend...")
plot_overall_trend(monthly, forecast)
plot_regional_trend(monthly, forecast)
