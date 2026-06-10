export default function Card({ 
  children, 
  className = '', 
  hoverEffect = true,
  variant = 'default',
  ...props 
}) {
  const baseStyles = 'glass-card rounded-xl'
  
  const variants = {
    default: 'backdrop-blur-md bg-white/30 border border-white/20',
    light: 'backdrop-blur-sm bg-white/20 border border-white/10',
    lighter: 'backdrop-blur-lg bg-white/40 border border-white/30',
  }

  const hoverClass = hoverEffect ? 'hover:shadow-glass-lg hover:bg-white/40 transition-all duration-300' : ''

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
