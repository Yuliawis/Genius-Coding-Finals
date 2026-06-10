export default function ProgressBar({ 
  progress = 0,
  showLabel = true,
  variant = 'default',
  className = '',
}) {
  const variants = {
    default: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500',
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="glass-card p-1 rounded-full overflow-hidden">
        <div
          className={`${variants[variant]} h-3 rounded-full transition-all duration-500 ease-out shadow-glow`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-slate-600 mt-2 text-center font-medium">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}
