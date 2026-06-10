import { useState } from 'react'

export default function ImageUpload() {
  const [fileName, setFileName] = useState('')

  return (
    <div className="glass-panel rounded-[24px] border-dashed p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Upload damage photo for severity review</p>
          <p className="mt-1 text-sm text-slate-600">
            Demo mode accepts a local image and previews the filename for later AI analysis wiring.
          </p>
        </div>
        <label className="glass-button glass-panel cursor-pointer text-slate-800">
          Choose Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setFileName(event.target.files?.[0]?.name || '')}
          />
        </label>
      </div>
      <div className="mt-4 rounded-2xl bg-white/35 px-4 py-3 text-sm text-slate-600">
        {fileName ? `Selected file: ${fileName}` : 'No image selected yet.'}
      </div>
    </div>
  )
}
