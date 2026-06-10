export default function StatCard({
  label = '',
  value = 0,
  unit = '',
  trend = null,
  icon = null,
  color = 'green',
  className = '',
}) {
  const colorMap = {
    green: 'from-emerald-500/20 to-emerald-200/40 text-emerald-900',
    blue: 'from-sky-500/20 to-cyan-200/40 text-sky-900',
    red: 'from-rose-500/20 to-orange-200/40 text-rose-900',
    yellow: 'from-amber-400/20 to-orange-100/40 text-amber-900',
    purple: 'from-violet-400/20 to-pink-200/40 text-violet-900',
  }

  return (
    <div className={`glass-card min-h-[172px] ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-tight text-slate-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="pb-1 text-sm text-slate-500">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className={`rounded-2xl bg-gradient-to-br px-4 py-3 text-sm font-semibold ${colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className={`font-semibold ${trend.direction === 'up' ? 'text-emerald-700' : 'text-rose-700'}`}>
            {trend.direction === 'up' ? '+' : '-'}
            {trend.value}%
          </span>
          <span className="text-slate-500">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
