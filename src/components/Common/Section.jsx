export default function Section({
  children,
  title = '',
  subtitle = '',
  glass = true,
  className = '',
  containerClassName = '',
}) {
  return (
    <section className={containerClassName}>
      <div className={`${glass ? 'glass-card' : ''} ${className}`}>
        {(title || subtitle) && (
          <div className="mb-6">
            {title && <h2 className="section-heading">{title}</h2>}
            {subtitle && <p className="section-copy mt-2 max-w-3xl">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
