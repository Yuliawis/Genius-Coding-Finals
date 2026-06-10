import { useState } from 'react'

export default function Alert({
  children,
  title,
  variant = 'info',
  closeable = true,
  icon = null,
  className = '',
  ...props
}) {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  const variants = {
    info: 'border-sky-200/60 bg-sky-100/35 text-sky-950',
    success: 'border-emerald-200/60 bg-emerald-100/35 text-emerald-950',
    warning: 'border-amber-200/70 bg-amber-100/40 text-amber-950',
    error: 'border-rose-200/60 bg-rose-100/35 text-rose-950',
  }

  const defaultIcons = {
    info: 'Info',
    success: 'Good',
    warning: 'Alert',
    error: 'Error',
  }

  return (
    <div className={`glass-panel rounded-3xl border px-5 py-4 ${variants[variant]} ${className}`} {...props}>
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          {icon || defaultIcons[variant]}
        </div>
        <div className="flex-1">
          {title && <h3 className="font-semibold">{title}</h3>}
          <div className="mt-1 text-sm leading-6">{children}</div>
        </div>
        {closeable && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium opacity-70 transition hover:opacity-100"
          >
            Close
          </button>
        )}
      </div>
    </div>
  )
}
