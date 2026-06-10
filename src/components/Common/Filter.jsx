import { useState } from 'react'
import Select from './Select'
import Button from './Button'

export default function Filter({ filters = [], onApply, className = '' }) {
  const [values, setValues] = useState({})

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    if (onApply) {
      onApply(values)
    }
  }

  return (
    <div className={`glass-card ${className}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Filters</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">Refine the active view</p>
        </div>
        <Button variant="secondary" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filters.map((filter) => (
          <Select
            key={filter.key}
            label={filter.label}
            options={filter.options}
            placeholder={filter.placeholder}
            value={values[filter.key] || ''}
            onChange={(e) => handleChange(filter.key, e.target.value)}
          />
        ))}
      </div>
    </div>
  )
}
