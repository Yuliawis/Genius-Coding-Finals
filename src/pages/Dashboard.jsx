import { useMemo, useState } from 'react'
import Hero from '../components/Common/Hero'
import StatCard from '../components/Common/StatCard'
import Section from '../components/Common/Section'
import SeverityChart from '../components/Dashboard/SeverityChart'
import ResourceTable from '../components/Dashboard/ResourceTable'
import Alert from '../components/Common/Alert'
import Filter from '../components/Common/Filter'
import GlobeView from '../components/Globe/GlobeView'
import disasters from '../data/disasters'
import yearlyRegionalForecastCsv from '../../outputs/yearly_forecast_by_region_and_disaster_type.csv?raw'

const totalPeople = disasters.reduce((sum, disaster) => sum + disaster.affectedPeople, 0)
const criticalCount = disasters.filter((disaster) => disaster.severity === 'critical').length
const regionCount = new Set(disasters.map((disaster) => disaster.location.split(',').pop().trim())).size

function parseCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values
}

function parseCsv(raw) {
  const lines = raw.trim().split(/\r?\n/)
  const headers = parseCsvLine(lines[0])

  return lines.slice(1).map((line) => {
    const columns = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, columns[index] ?? '']))
  })
}

const yearlyRegionalForecast = parseCsv(yearlyRegionalForecastCsv).map((row) => ({
  ...row,
  year: Number(row.year),
  predicted_count: Number(row.predicted_count),
}))

const forecastYears = [...new Set(yearlyRegionalForecast.map((row) => row.year))].sort((a, b) => a - b)
const firstForecastYear = forecastYears[0]

function buildForecastInsight(disasterType, regionalRows) {
  const firstYearRows = regionalRows.filter((row) => row.year === firstForecastYear && row['Disaster Type'] === disasterType)
  const total = firstYearRows.reduce((sum, row) => sum + row.predicted_count, 0)
  const topRegion = [...firstYearRows].sort((a, b) => b.predicted_count - a.predicted_count)[0]

  let level = 'Low'
  if (total >= 20) level = 'High'
  else if (total >= 5) level = 'Medium'

  const descriptor = disasterType.toLowerCase()
  const roundedTotal = Math.round(total)
  const regionText = topRegion?.Region || 'the monitored regions'

  const messageMap = {
    Flood: `${regionText} shows the strongest projected ${descriptor} pressure in ${firstForecastYear}, with about ${roundedTotal} forecast events overall.`,
    Wildfire: `${regionText} carries the clearest projected ${descriptor} signal in ${firstForecastYear}, with about ${roundedTotal} forecast events overall.`,
    Storm: `${regionText} remains the main projected ${descriptor} zone in ${firstForecastYear}, with about ${roundedTotal} forecast events overall.`,
  }

  return {
    label: `${disasterType} Risk`,
    level,
    message: messageMap[disasterType] || `${regionText} leads the projected ${descriptor} activity in ${firstForecastYear}.`,
  }
}

export default function Dashboard() {
  const [filters, setFilters] = useState({})

  const filteredData = useMemo(() => {
    return disasters.filter((disaster) => {
      const severityMatch = !filters.severity || disaster.severity === filters.severity
      const typeMatch = !filters.type || disaster.type?.toLowerCase() === filters.type
      return severityMatch && typeMatch
    })
  }, [filters])

  const filteredTotalPeople = filteredData.reduce((sum, disaster) => sum + disaster.affectedPeople, 0)
  const filteredCriticalCount = filteredData.filter((disaster) => disaster.severity === 'critical').length
  const filteredRegionCount = new Set(filteredData.map((disaster) => disaster.location.split(',').pop().trim())).size

  const latestEvents = [...filteredData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  const forecastInsights = useMemo(
    () => [
      buildForecastInsight('Flood', yearlyRegionalForecast),
      buildForecastInsight('Wildfire', yearlyRegionalForecast),
      buildForecastInsight('Storm', yearlyRegionalForecast),
    ],
    [],
  )

  return (
    <>
      <Hero
        title="Operational dashboard"
        subtitle="Dashboard"
        description="Here you can track active incidents, resource posture, and risk patterns."
        image={
          <div className="glass-panel-strong relative rounded-[28px] p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Alerts</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{filteredData.length}</p>
                <p className="mt-1 text-sm text-slate-600">Across {filteredRegionCount} regions</p>
              </div>
              <div className="rounded-3xl bg-slate-950/85 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Affected</p>
                <p className="mt-3 text-3xl font-semibold">{(filteredTotalPeople / 1e6).toFixed(1)}M</p>
                <p className="mt-1 text-sm text-white/70">People impacted</p>
              </div>
              <div className="col-span-2 rounded-3xl bg-white/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Critical Watch</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{filteredCriticalCount} events need response</p>
                  </div>
                  <div className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">Live</div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="page-wrap space-y-8">
        <Alert variant="warning" title="Critical watch">
          {filteredCriticalCount} active critical disaster events match the current filters. Use the resource inventory and analytics views to explain prioritization decisions.
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
          <StatCard label="People Affected" value={filteredTotalPeople} unit="people" icon="Scale" color="blue" trend={{ direction: 'up', value: 23, label: 'response load' }} />
          <StatCard label="Critical Events" value={filteredCriticalCount} icon="Priority" color="yellow" trend={{ direction: 'down', value: 8, label: 'with containment efforts' }} />
          <StatCard label="Regions Impacted" value={filteredRegionCount} icon="Map" color="purple" trend={{ direction: 'up', value: 15, label: 'new zones monitored' }} />
        </section>

        <Section
          title="Interactive global alert map"
          subtitle="Check out a 3d map."
        >
          <GlobeView alerts={filteredData} />
        </Section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Section
            title="Severity trendline"
            subtitle="Month-over-month movement across the major disaster categories."
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
          >
            <ResourceTable />
          </Section>

          <Section
            title="Predictions and insights"
          >
            <div className="grid gap-4">
              {forecastInsights.map((item) => (
                <div key={item.label} className="rounded-[24px] bg-white/35 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.level}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.message}</p>
                </div>
              ))}
            </div>
          </Section>
        </section>
      </div>
    </>
  )
}
