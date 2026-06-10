export default function StatCard({ label, value, unit = '', accent = '#4ade80' }) {
  return (
    <div style={{ border: '1px solid #2d2d2d', borderRadius: 12, padding: '1.5rem', background: '#111' }}>
      <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontSize: '2rem', fontWeight: 700, color: accent, lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span style={{ fontSize: '1rem', color: '#888', marginLeft: 4 }}>{unit}</span>}
      </p>
    </div>
  )
}
