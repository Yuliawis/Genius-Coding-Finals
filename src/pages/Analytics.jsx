import { useState } from 'react'
import Hero from '../components/Common/Hero'
import Section from '../components/Common/Section'
import StatCard from '../components/Common/StatCard'
import Filter from '../components/Common/Filter'
import SeverityChart from '../components/Dashboard/SeverityChart'
import Alert from '../components/Common/Alert'
import monthlyForecastCsv from '../../outputs/monthly_forecast_by_region_and_disaster_type.csv?raw'
import yearlyForecastCsv from '../../outputs/yearly_forecast_by_region_and_disaster_type.csv?raw'

const FORECAST_LINES = [
  { key: 'Flood', color: '#2563eb', name: 'Flood' },
  { key: 'Storm', color: '#7c3aed', name: 'Storm' },
  { key: 'Earthquake', color: '#475569', name: 'Earthquake' },
  { key: 'Wildfire', color: '#ea580c', name: 'Wildfire' },
]

function parseCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values
}

function parseCsv(raw) {
  const lines = raw.trim().split(/\r?\n/)
  const headers = parseCsvLine(lines[0])

  return lines.slice(1).map((line) => {
    const columns = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, columns[index] ?? '']))
  })
}

const monthlyForecast = parseCsv(monthlyForecastCsv).map((row) => ({
  ...row,
  year: Number(row.year),
  month: Number(row.month),
  predicted_count: Number(row.predicted_count),
}))

const yearlyForecast = parseCsv(yearlyForecastCsv).map((row) => ({
  ...row,
  year: Number(row.year),
  predicted_count: Number(row.predicted_count),
}))

const availableYears = [...new Set(yearlyForecast.map((row) => row.year))].sort((a, b) => a - b)
const defaultForecastYear = availableYears[0]

function formatMonthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  })
}

export default function Analytics() {
  const [selectedRegion, setSelectedRegion] = useState('All regions')
  const [selectedRange, setSelectedRange] = useState('12m')

  const handleFilterApply = (values) => {
    const regionMap = {
      na: 'Americas',
      sa: 'Americas',
      eu: 'Europe',
      asia: 'Asia',
      africa: 'Africa',
    }

    setSelectedRegion(regionMap[values.region] || 'All regions')
    setSelectedRange(values.timeRange || '12m')
  }

  const monthsToShow = {
    '3m': 3,
    '6m': 6,
    '12m': 12,
    '24m': 24,
  }[selectedRange] || 12

  const regionAwareForecast = monthlyForecast.filter((row) => (
    selectedRegion === 'All regions' ? true : row.Region === selectedRegion
  ))

  const regionAwareYearlyForecast = yearlyForecast.filter((row) => (
    selectedRegion === 'All regions' ? true : row.Region === selectedRegion
  ))

  const uniqueTypesInScope = new Set(regionAwareForecast.map((row) => row['Disaster Type'])).size || 1
  const monthlyRows = regionAwareForecast.slice(0, monthsToShow * uniqueTypesInScope)
  const chartData = monthlyRows.reduce((accumulator, row) => {
    const key = `${row.year}-${row.month}`
    const existing = accumulator.get(key) || {
      label: formatMonthLabel(row.year, row.month),
    }

    existing[row['Disaster Type']] = Number(row.predicted_count.toFixed(1))
    accumulator.set(key, existing)
    return accumulator
  }, new Map())

  const forecastChartData = Array.from(chartData.values())
  const firstYearRows = regionAwareYearlyForecast.filter((row) => row.year === defaultForecastYear)
  const topTypes = [...firstYearRows]
    .sort((a, b) => b.predicted_count - a.predicted_count)
    .slice(0, 4)

  const totalForecastEvents = firstYearRows.reduce((sum, row) => sum + row.predicted_count, 0)
  const mostCommon = topTypes[0]
  const peakMonth = [...forecastChartData]
    .map((row) => ({
      label: row.label,
      total: FORECAST_LINES.reduce((sum, line) => sum + (Number(row[line.key]) || 0), 0),
    }))
    .sort((a, b) => b.total - a.total)[0]

  const highestGrowth = [...topTypes].sort((a, b) => b.predicted_count - a.predicted_count)[0]
  const analysisCards = topTypes.map((row, index) => {
    const nextYearRow = regionAwareYearlyForecast.find((item) => (
      item.year === defaultForecastYear + 1 &&
      item['Disaster Type'] === row['Disaster Type']
    ))
    const growth = nextYearRow ? ((nextYearRow.predicted_count - row.predicted_count) / Math.max(row.predicted_count, 1)) * 100 : 0
    const widths = ['78%', '68%', '55%', '42%']
    const bars = [
      'from-sky-500 to-cyan-500',
      'from-violet-500 to-indigo-500',
      'from-slate-500 to-slate-700',
      'from-orange-500 to-amber-500',
    ]

    return {
      title: row['Disaster Type'],
      incidents: Math.round(row.predicted_count),
      trend: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% projected into ${defaultForecastYear + 1}`,
      width: widths[index] || '45%',
      bar: bars[index] || 'from-sky-500 to-cyan-500',
    }
  })

  return (
    <>
      <Hero
        title="ML-backed forecasting for future disaster trends"
        subtitle="Forecasting and Insight Layer"
        description="This view now reads directly from the generated regional forecast outputs, turning the model results into future trend charts and planning signals that react to the selected region."
        image={
          <div className="glass-panel-strong relative rounded-[28px] p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Forecast Year</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{defaultForecastYear}</p>
                <p className="mt-1 text-sm text-slate-600">{Math.round(totalForecastEvents)} predicted disasters in {selectedRegion}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/85 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Forecast Horizon</p>
                <p className="mt-3 text-3xl font-semibold">{availableYears.length} years</p>
                <p className="mt-1 text-sm text-white/70">{availableYears[0]} to {availableYears[availableYears.length - 1]}</p>
              </div>
              <div className="col-span-2 rounded-3xl bg-white/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trend</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{mostCommon?.['Disaster Type'] || 'Flood'} leads the projected count in {selectedRegion} for {defaultForecastYear}</p>
                  </div>
                  <div className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">Forecast</div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="page-wrap space-y-8">
        <Filter
          filters={[
            {
              key: 'timeRange',
              label: 'Time Range',
              placeholder: 'Select period',
              options: [
                { label: 'Last 3 months', value: '3m' },
                { label: 'Last 6 months', value: '6m' },
                { label: 'Last 12 months', value: '12m' },
                { label: 'Last 24 months', value: '24m' },
              ],
            },
            {
              key: 'region',
              label: 'Region',
              placeholder: 'All regions',
              options: [
                { label: 'North America', value: 'na' },
                { label: 'South America', value: 'sa' },
                { label: 'Europe', value: 'eu' },
                { label: 'Asia', value: 'asia' },
                { label: 'Africa', value: 'africa' },
              ],
            },
          ]}
          onApply={handleFilterApply}
        />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Events" value={Math.round(totalForecastEvents)} icon="Data" color="blue" />
          <StatCard label="Peak Month" value={peakMonth?.label || 'N/A'} icon="Season" color="yellow" />
          <StatCard label="Most Common" value={mostCommon?.['Disaster Type'] || 'N/A'} icon="Pattern" color="purple" />
          <StatCard label="Tracked Types" value={new Set(yearlyForecast.map((row) => row['Disaster Type'])).size} icon="Risk" color="red" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Section
            title="Trendline overview"
            subtitle={`Future monthly forecast from the regional output files for ${selectedRegion}.`}
          >
            <SeverityChart data={forecastChartData} lines={FORECAST_LINES} xKey="label" yLabel="Forecasted Events" />
          </Section>

          <div className="space-y-4">
            <Alert variant="success" title="Positive Trend" closeable={false}>
              The forecast suggests the busiest month in the visible horizon is {peakMonth?.label || 'the upcoming peak window'}.
            </Alert>
            <Alert variant="warning" title="Seasonal Pattern" closeable={false}>
              {mostCommon?.['Disaster Type'] || 'Flood'} is projected to remain the most frequent disaster type in {selectedRegion} during {defaultForecastYear}.
            </Alert>
            <Alert variant="info" title="Prediction" closeable={false}>
              The graph is now rendered from `outputs/monthly_forecast_by_region_and_disaster_type.csv`.
            </Alert>
          </div>
        </section>

        <Section
          title="Disaster type analysis"
          subtitle="These cards combine incident counts and trend direction into a format that reads well in both desktop demos and quick verbal walkthroughs."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {analysisCards.map((card) => (
              <div key={card.title} className="rounded-[24px] bg-white/35 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <span className="text-sm font-medium text-slate-500">{card.incidents} incidents</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/45">
                  <div className={`h-3 rounded-full bg-gradient-to-r ${card.bar}`} style={{ width: card.width }} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{card.trend}</p>
              </div>
            ))}
          </div>
        </Section>

        <section>
          <Section
            title="Forecast coverage"
            subtitle="Simple model output facts drawn from the generated forecast files."
          >
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Forecast Start</span><span className="font-semibold text-slate-900">{availableYears[0]}</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Forecast End</span><span className="font-semibold text-slate-900">{availableYears[availableYears.length - 1]}</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Monthly Rows</span><span className="font-semibold text-slate-900">{regionAwareForecast.length}</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Yearly Rows</span><span className="font-semibold text-slate-900">{regionAwareYearlyForecast.length}</span></div>
            </div>
          </Section>
        </section>
      </div>
    </>
  )
}
