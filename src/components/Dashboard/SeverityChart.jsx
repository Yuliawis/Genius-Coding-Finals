import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import trends from '../../data/trends.json'

const DEFAULT_LINES = [
  { key: 'wildfires', color: '#dd6b20', name: 'Wildfires' },
  { key: 'floods', color: '#3b82f6', name: 'Floods' },
  { key: 'earthquakes', color: '#64748b', name: 'Earthquakes' },
  { key: 'hurricanes', color: '#a855f7', name: 'Hurricanes' },
]

export default function SeverityChart({
  data = trends,
  lines = DEFAULT_LINES,
  xKey = 'month',
  yLabel = 'Incidents',
}) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)} ${yLabel.toLowerCase()}`, yLabel]}
            contentStyle={{
              background: 'rgba(255,255,255,0.78)',
              border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: '20px',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
              backdropFilter: 'blur(18px)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#475569' }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              name={line.name}
              strokeWidth={3}
              dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
