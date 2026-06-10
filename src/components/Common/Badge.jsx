export default function Badge({ 
  children, 
  variant = 'default',
  severity = null,
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300'
  
  const severityMap = {
    critical: 'backdrop-blur-sm bg-red-500/20 border border-red-400/50 text-red-700',
    high: 'backdrop-blur-sm bg-orange-500/20 border border-orange-400/50 text-orange-700',
    medium: 'backdrop-blur-sm bg-yellow-500/20 border border-yellow-400/50 text-yellow-700',
    low: 'backdrop-blur-sm bg-green-500/20 border border-green-400/50 text-green-700',
  }

  const variants = {
    default: 'glass text-slate-700',
    success: 'backdrop-blur-sm bg-green-500/20 border border-green-400/50 text-green-700',
    warning: 'backdrop-blur-sm bg-yellow-500/20 border border-yellow-400/50 text-yellow-700',
    error: 'backdrop-blur-sm bg-red-500/20 border border-red-400/50 text-red-700',
    info: 'backdrop-blur-sm bg-blue-500/20 border border-blue-400/50 text-blue-700',
  }

  const style = severity ? severityMap[severity] : variants[variant]

  return (
    <span
      className={`${baseStyles} ${style} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
