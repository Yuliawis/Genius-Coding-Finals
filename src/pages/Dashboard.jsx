import { useMemo, useState } from 'react'
import Hero from '../components/Common/Hero'
import StatCard from '../components/Common/StatCard'
import Section from '../components/Common/Section'
import SeverityChart from '../components/Dashboard/SeverityChart'
import ResourceTable from '../components/Dashboard/ResourceTable'
import Alert from '../components/Common/Alert'
import Filter from '../components/Common/Filter'
import GlobeView from '../components/Globe/GlobeView'
import disasters, { disasterSource } from '../data/disasters'

const totalPeople = disasters.reduce((sum, disaster) => sum + disaster.affectedPeople, 0)
const criticalCount = disasters.filter((disaster) => disaster.severity === 'critical').length
const regionCount = new Set(disasters.map((disaster) => disaster.location.split(',').pop().trim())).size

export default function Dashboard() {
  const [filters, setFilters] = useState({})

  const filteredData = useMemo(() => {
    return disasters.filter((disaster) => {
      const severityMatch = !filters.severity || disaster.severity === filters.severity
      const typeMatch = !filters.type || disaster.type?.toLowerCase() === filters.type
      return severityMatch && typeMatch
    })
  }, [filters])

  const latestEvents = filteredData.slice(0, 3)

  return (
    <>
      <Hero
        title="Operational dashboard with calm, high-clarity glass panels"
        subtitle="Live Response Dashboard"
        description="Track active incidents, resource posture, and near-term risk patterns in a presentation-ready control room built for fast comprehension."
      />

      <div className="page-wrap space-y-8">
        <div className="glass-panel rounded-[24px] px-5 py-4 text-sm text-slate-700">
          Current alerts are mapped from {disasterSource.provider} data in <span className="font-semibold">{disasterSource.localExport}</span>.
        </div>
        <Alert variant="warning" title="Critical watch">
          {criticalCount} active critical disaster events are still present in the demo dataset. Use the resource inventory and analytics views to explain prioritization decisions.
        </Alert>

        <Filter
          filters={[
            {
              key: 'severity',
              label: 'Severity',
              placeholder: 'All severities',
              options: [
                { label: 'Critical', value: 'critical' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' },
              ],
            },
            {
              key: 'type',
              label: 'Disaster Type',
              placeholder: 'All types',
              options: [
                { label: 'Wildfire', value: 'wildfire' },
                { label: 'Flood', value: 'flood' },
                { label: 'Earthquake', value: 'earthquake' },
                { label: 'Hurricane', value: 'hurricane' },
              ],
            },
          ]}
          onApply={setFilters}
        />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active Disasters" value={filteredData.length} icon="Watch" color="red" trend={{ direction: 'up', value: 12, label: 'vs last month' }} />
          <StatCard label="People Affected" value={totalPeople} unit="people" icon="Scale" color="blue" trend={{ direction: 'up', value: 23, label: 'response load' }} />
          <StatCard label="Critical Events" value={criticalCount} icon="Priority" color="yellow" trend={{ direction: 'down', value: 8, label: 'with containment efforts' }} />
          <StatCard label="Regions Impacted" value={regionCount} icon="Map" color="purple" trend={{ direction: 'up', value: 15, label: 'new zones monitored' }} />
        </section>

        <Section
          title="Interactive global alert map"
          subtitle="The 3D globe, alert points, popup cards, and explorer panel now live in the dashboard where the operational experience belongs."
        >
          <GlobeView />
        </Section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Section
            title="Severity trendline"
            subtitle="Month-over-month movement across the major disaster categories represented in the MVP."
          >
            <SeverityChart />
          </Section>

          <div className="glass-dark rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Immediate Briefing</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Upcoming response focus</h2>
            <div className="mt-6 space-y-4">
              {latestEvents.map((event) => (
                <div key={event.id} className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                  <p className="text-sm font-medium text-white">{event.type}</p>
                  <p className="mt-2 text-sm text-white/70">{event.location}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="capitalize text-amber-200">{event.severity}</span>
                    <span className="text-white/60">{event.affectedPeople.toLocaleString()} affected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Section
            title="Resource inventory"
            subtitle="Glass-styled table for live explanation of logistics, stock, and deployment readiness."
          >
            <ResourceTable />
          </Section>

          <Section
            title="Predictions and insights"
            subtitle="Simple forecast takeaways that are easy to speak through in a judging demo."
          >
            <div className="grid gap-4">
              <div className="rounded-[24px] bg-white/35 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Flood Risk</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Low</p>
                <p className="mt-2 text-sm text-slate-600">Most monitored regions show stable conditions over the next 7 days.</p>
              </div>
              <div className="rounded-[24px] bg-white/35 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Wildfire Risk</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">Medium</p>
                <p className="mt-2 text-sm text-slate-600">Western zones remain heat-sensitive and should keep crews ready.</p>
              </div>
              <div className="rounded-[24px] bg-white/35 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Storm Risk</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">High</p>
                <p className="mt-2 text-sm text-slate-600">Coastal regions need extra shelter coordination and communications prep.</p>
              </div>
            </div>
          </Section>
        </section>
      </div>
    </>
  )
}
