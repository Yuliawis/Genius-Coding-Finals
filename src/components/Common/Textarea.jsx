import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { placeholder = '', error = false, label = null, rows = 4, className = '', ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        className={`glass-input resize-none ${error ? 'border-rose-300 focus:ring-rose-300/50' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  )
})

export default Textarea
