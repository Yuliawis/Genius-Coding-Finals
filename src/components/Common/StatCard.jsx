import { statIcons } from './icons'

export default function StatCard({
  label = '',
  value = 0,
  unit = '',
  trend = null,
  icon = null,
  color = 'green',
  compact = false,
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
    <div className={`glass-card ${compact ? 'min-h-[138px] p-5' : 'min-h-[172px]'} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
          <div className={`flex items-end gap-2 ${compact ? 'mt-3' : 'mt-4'}`}>
            <span className={`${compact ? 'text-3xl' : 'text-4xl'} font-semibold tracking-tight text-slate-900`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="pb-1 text-sm text-slate-500">{unit}</span>}
          </div>
        </div>
        {icon && statIcons[icon] && (
          <div className={`rounded-2xl bg-gradient-to-br ${compact ? 'p-2.5' : 'p-3'} ${colorMap[color]}`}>
            {(() => {
              const Icon = statIcons[icon]
              return <Icon className={compact ? 'h-4.5 w-4.5' : 'h-5 w-5'} />
            })()}
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
