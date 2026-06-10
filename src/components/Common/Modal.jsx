import { useEffect } from 'react'

export default function Modal({
  isOpen = false,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" className="absolute inset-0 bg-slate-950/35 backdrop-blur-md" onClick={onClose} aria-label="Close modal" />
      <div className={`glass-panel-strong relative w-full rounded-[32px] ${sizes[size]} ${className}`}>
        {title && (
          <div className="flex items-center justify-between border-b border-white/35 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <button type="button" onClick={onClose} className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
              Close
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 border-t border-white/35 px-6 py-5">{footer}</div>}
      </div>
    </div>
  )
}
