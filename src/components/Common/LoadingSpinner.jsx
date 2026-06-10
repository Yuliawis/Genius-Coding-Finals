export default function LoadingSpinner({ 
  size = 'md',
  text = 'Loading...',
  className = '',
}) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`glass-card p-4 rounded-full ${sizes[size]}`}>
        <div className={`${sizes[size]} border-4 border-white/30 border-t-green-500 rounded-full animate-spin`} />
      </div>
      {text && <p className="text-slate-700 font-medium">{text}</p>}
    </div>
  )
}
