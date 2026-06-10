import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { type = 'text', placeholder = '', error = false, label = null, className = '', ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`glass-input ${error ? 'border-rose-300 focus:ring-rose-300/50' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  )
})

export default Input
