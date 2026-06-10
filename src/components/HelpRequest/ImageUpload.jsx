export default function ImageUpload({ fileName = '', onFileChange, analysisHint = '' }) {
  return (
    <div className="glass-panel rounded-[24px] border-dashed p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Upload damage photo for severity review</p>
          <p className="mt-1 text-sm text-slate-600">
            Upload a JPG image and the backend will send it to Gemini to estimate disaster severity from visible damage.
          </p>
        </div>
        <label className="glass-button glass-panel cursor-pointer text-slate-800">
          Choose Image
          <input
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            className="hidden"
            onChange={(event) => onFileChange?.(event.target.files?.[0] || null)}
          />
        </label>
      </div>
      <div className="mt-4 rounded-2xl bg-white/35 px-4 py-3 text-sm text-slate-600">
        {fileName ? `Selected file: ${fileName}` : 'No image selected yet.'}
      </div>
      {analysisHint && (
        <div className="mt-3 rounded-2xl bg-sky-50/70 px-4 py-3 text-sm text-sky-900">
          {analysisHint}
        </div>
      )}
    </div>
  )
}
