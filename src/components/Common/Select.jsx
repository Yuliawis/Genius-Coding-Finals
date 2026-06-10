import { forwardRef } from 'react'

const Select = forwardRef(function Select(
  { placeholder = 'Select an option...', error = false, label = null, options = [], className = '', ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>}
      <select
        ref={ref}
        className={`glass-input appearance-none ${error ? 'border-rose-300 focus:ring-rose-300/50' : ''} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  )
})

export default Select
