export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles = 'glass-button'

  const variants = {
    primary: 'bg-gradient-to-r from-amber-700 via-orange-600 to-rose-500 text-white shadow-lg shadow-orange-900/20 hover:-translate-y-0.5 hover:shadow-xl',
    secondary: 'glass-panel text-slate-800 hover:bg-white/55',
    danger: 'bg-gradient-to-r from-rose-600 to-red-500 text-white hover:-translate-y-0.5',
    ghost: 'text-slate-700 hover:bg-white/25',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-7 py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
