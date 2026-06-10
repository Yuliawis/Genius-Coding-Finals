import Button from '../Common/Button'

export default function ScenarioCard({ scenario, answered, onAnswer, onNext, isLast }) {
  return (
    <div className="glass-dark rounded-[32px] p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Active Situation</p>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-white/90">{scenario.situation}</p>
        </div>
        <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
          {scenario.points} pts
        </div>
      </div>

      <div className="grid gap-3">
        {scenario.choices.map((choice, index) => {
          let choiceClass = 'border-white/15 bg-white/6 text-white/85 hover:bg-white/12'
          if (answered !== null) {
            if (index === scenario.correct) {
              choiceClass = 'border-emerald-400/40 bg-emerald-400/15 text-emerald-100'
            } else if (index === answered) {
              choiceClass = 'border-rose-400/40 bg-rose-400/15 text-rose-100'
            }
          }

          return (
            <button
              key={choice}
              type="button"
              disabled={answered !== null}
              onClick={() => onAnswer(index)}
              className={`rounded-2xl border px-4 py-4 text-left text-sm leading-6 transition ${choiceClass}`}
            >
              {choice}
            </button>
          )
        })}
      </div>

      {answered !== null && (
        <div className="mt-6 rounded-[28px] border border-emerald-300/20 bg-white/8 p-5">
          <p className="text-sm leading-7 text-white/80">{scenario.explanation}</p>
          <div className="mt-5">
            <Button onClick={onNext}>{isLast ? 'See Results' : 'Next Scenario'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
