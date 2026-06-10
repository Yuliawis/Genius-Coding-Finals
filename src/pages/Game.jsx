import Hero from '../components/Common/Hero'
import Section from '../components/Common/Section'
import GameEngine from '../components/Game/GameEngine'
import StatCard from '../components/Common/StatCard'
import Alert from '../components/Common/Alert'

const tipCards = [
  {
    title: 'Wildfire',
    tips: ['Evacuate immediately if ordered', 'Close windows and doors', 'Follow emergency broadcasts', 'Keep documents ready'],
  },
  {
    title: 'Flood',
    tips: ['Move to higher ground', 'Never drive through floodwater', 'Turn off utilities if safe', 'Alert nearby neighbors'],
  },
  {
    title: 'Earthquake',
    tips: ['Drop, cover, and hold on', 'Stay away from windows', 'Avoid elevators', 'Check for hazards afterward'],
  },
  {
    title: 'Hurricane',
    tips: ['Secure openings and loose items', 'Store food and water', 'Track surge zones', 'Evacuate when instructed'],
  },
]

export default function Game() {
  return (
    <>
      <Hero
        title="Preparedness game redesigned like an immersive mission room"
        subtitle="Interactive Awareness Module"
        description="Turn disaster education into something judges can try live. The game keeps the scenario loop simple, visual, and easy to explain while still supporting meaningful learning outcomes."
        image={
          <div className="glass-panel-strong relative rounded-[28px] p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Scenarios</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">8</p>
                <p className="mt-1 text-sm text-slate-600">Real-world situations</p>
              </div>
              <div className="rounded-3xl bg-slate-950/85 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Scoring</p>
                <p className="mt-3 text-3xl font-semibold">+10</p>
                <p className="mt-1 text-sm text-white/70">Per safe choice</p>
              </div>
              <div className="col-span-2 rounded-3xl bg-white/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Goal</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">Build everyday preparedness habits</p>
                  </div>
                  <div className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">Play</div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="page-wrap space-y-8">
        <Alert variant="info" title="How to play">
          Each scenario asks the player to choose the best response. The system awards points for safer decisions and reveals an explanation after every choice.
        </Alert>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard label="Experience" value="Scenario-Based" icon="Learn" color="yellow" />
          <StatCard label="Scoring" value="Instant" icon="Points" color="green" />
          <StatCard label="Goal" value="Preparedness" icon="Ready" color="blue" />
        </section>

        <Section
          title="Active training simulation"
          subtitle="A dark glass surface creates contrast so the game feels distinct from the analytics pages while staying in the same overall design system."
        >
          <GameEngine />
        </Section>

        <Section
          title="Quick response reminders"
          subtitle="These compact cards reinforce the educational angle of the MVP and make the page feel fuller for demo use."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {tipCards.map((card) => (
              <div key={card.title} className="rounded-[24px] bg-white/35 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {card.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  )
}
