import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import trends from '../../data/trends.json'

const LINES = [
  { key: 'wildfires', color: '#dd6b20', name: 'Wildfires' },
  { key: 'floods', color: '#3b82f6', name: 'Floods' },
  { key: 'earthquakes', color: '#64748b', name: 'Earthquakes' },
  { key: 'hurricanes', color: '#a855f7', name: 'Hurricanes' },
]

export default function SeverityChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trends} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(255,255,255,0.78)',
              border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: '20px',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
              backdropFilter: 'blur(18px)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#475569' }} />
          {LINES.map((line) => (
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
