export default function ScoreBoard({ score, current, total }) {
  const progress = `${Math.round((current / total) * 100)}%`

  return (
    <div className="glass-panel-strong mb-6 rounded-[28px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Scenario Progress</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            Question {current} of {total}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Score</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{score}</p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/40">
        <div className="h-2 rounded-full bg-gradient-to-r from-amber-700 to-rose-500" style={{ width: progress }} />
      </div>
    </div>
  )
}
