import resources from '../../data/resources.json'

const statusClasses = {
  available: 'bg-emerald-100/70 text-emerald-800',
  limited: 'bg-amber-100/70 text-amber-800',
  deployed: 'bg-sky-100/70 text-sky-800',
}

export default function ResourceTable() {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-white/40 bg-white/25">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
          <tr>
            <th className="px-4 py-4 font-medium">Item</th>
            <th className="px-4 py-4 font-medium">Category</th>
            <th className="px-4 py-4 text-right font-medium">Qty</th>
            <th className="px-4 py-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} className="border-t border-white/35 text-slate-700">
              <td className="px-4 py-4 font-medium text-slate-900">{resource.name}</td>
              <td className="px-4 py-4">{resource.category}</td>
              <td className="px-4 py-4 text-right">
                {resource.quantity.toLocaleString()} {resource.unit}
              </td>
              <td className="px-4 py-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClasses[resource.status] || statusClasses.available}`}>
                  {resource.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
