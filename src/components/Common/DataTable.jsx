export default function DataTable({ 
  columns = [],
  data = [],
  className = '',
}) {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-slate-900"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-white/10 hover:bg-white/10 transition-colors duration-200"
              >
                {columns.map((column) => (
                  <td
                    key={`${idx}-${column.key}`}
                    className="px-6 py-4 text-sm text-slate-800"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
