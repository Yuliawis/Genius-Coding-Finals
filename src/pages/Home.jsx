import { useNavigate } from 'react-router-dom'
import Button from '../components/Common/Button'
import Section from '../components/Common/Section'
import StatCard from '../components/Common/StatCard'
import disasters from '../data/disasters'

const totalAffected = disasters.reduce((sum, disaster) => sum + disaster.affectedPeople, 0)
const criticalCount = disasters.filter((disaster) => disaster.severity === 'critical').length
const countryCount = new Set(disasters.map((disaster) => disaster.location.split(',').pop().trim())).size

const chips = [
  { position: 'left-[2%] top-[10%] -rotate-6', label: 'Wildfire Alert' },
  { position: 'left-[1%] top-[44%] rotate-3', label: 'AI Severity Scan' },
  { position: 'left-[3%] bottom-[8%] -rotate-3', label: 'Resource Tracker' },
  { position: 'right-[2%] top-[10%] rotate-6', label: 'Live Global Map' },
  { position: 'right-[1%] top-[44%] -rotate-3', label: 'Flood Warning' },
  { position: 'right-[3%] bottom-[8%] rotate-3', label: 'Readiness Score' },
]

const features = [
  {
    title: 'Dashboard',
    description: 'Track active incidents, severity trends, and resource posture on an interactive 3D globe.',
    cta: 'Open Dashboard',
    path: '/dashboard',
  },
  {
    title: 'Request Help',
    description: 'Describe what you really need and we will work to prioritize response.',
    cta: 'Request Help',
    path: '/help',
  },
  {
    title: 'Preparedness Game',
    description: 'Practice disaster scenarios, make decisions, and build awareness through interactive challenges.',
    cta: 'Play Now',
    path: '/game',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <section className="page-wrap relative overflow-hidden pt-16 pb-24 text-center">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className={`glass-panel-strong absolute ${chip.position} hidden items-center rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 shadow-glass-lg xl:flex`}
          >
            {chip.label}
          </div>
        ))}

        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-sky-700 via-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Respond
            </span>{' '}
            faster.
            <br />
            Prepare smarter.
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600">
              Natural disasters are unavoidable, but we can prepare. Because many feel immune, ResilienCity helps residents and authorities realize the risk and get ready together.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="xl" onClick={() => navigate('/dashboard')}>
              Open Dashboard
            </Button>
            <Button variant="secondary" size="xl" onClick={() => navigate('/help')}>
              Request Help
            </Button>
          </div>
        </div>
      </section>

      <div className="page-wrap space-y-8 pt-0">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active Disasters" value={disasters.length} icon="Watch" color="red" compact />
          <StatCard label="People Affected" value={totalAffected} unit="people" icon="Scale" color="blue" compact />
          <StatCard label="Critical Events" value={criticalCount} icon="Priority" color="yellow" compact />
          <StatCard label="Countries Tracked" value={countryCount} icon="Map" color="purple" compact />
        </section>

        <Section
          title="Explore the platform"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="glass-panel flex flex-col justify-between rounded-[24px] p-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
                <Button variant="secondary" className="mt-6 w-full" onClick={() => navigate(feature.path)}>
                  {feature.cta}
                </Button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  )
}
