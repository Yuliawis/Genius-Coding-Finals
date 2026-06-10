import { useState } from 'react'
import Hero from '../components/Common/Hero'
import Section from '../components/Common/Section'
import StatCard from '../components/Common/StatCard'
import Filter from '../components/Common/Filter'
import SeverityChart from '../components/Dashboard/SeverityChart'
import Alert from '../components/Common/Alert'

const analysisCards = [
  { title: 'Wildfires', incidents: 89, trend: '18% increase YoY', width: '65%', bar: 'from-orange-500 to-rose-500' },
  { title: 'Floods', incidents: 72, trend: '8% decrease YoY', width: '52%', bar: 'from-sky-500 to-cyan-500' },
  { title: 'Earthquakes', incidents: 54, trend: '3% increase YoY', width: '39%', bar: 'from-slate-500 to-slate-700' },
  { title: 'Hurricanes', incidents: 32, trend: '12% decrease YoY', width: '23%', bar: 'from-violet-500 to-fuchsia-500' },
]

export default function Analytics() {
  const [selectedRegion, setSelectedRegion] = useState('All regions')

  const handleFilterApply = (values) => {
    const regionMap = {
      na: 'North America',
      sa: 'South America',
      eu: 'Europe',
      asia: 'Asia',
      africa: 'Africa',
    }

    setSelectedRegion(regionMap[values.region] || 'All regions')
  }

  return (
    <>
      <Hero
        title="Analytics pages now feel like premium executive briefings"
        subtitle="Forecasting and Insight Layer"
        description="Use this view to explain trend analysis, model confidence, and seasonal risk signals with polished cards instead of raw charts alone."
        image={
          <div className="glass-panel-strong relative rounded-[28px] p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Events</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">247</p>
                <p className="mt-1 text-sm text-slate-600">+34% vs last year</p>
              </div>
              <div className="rounded-3xl bg-slate-950/85 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Model Accuracy</p>
                <p className="mt-3 text-3xl font-semibold">87.3%</p>
                <p className="mt-1 text-sm text-white/70">Severity prediction</p>
              </div>
              <div className="col-span-2 rounded-3xl bg-white/40 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trend</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">Wildfire activity rising in dry months</p>
                  </div>
                  <div className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">Forecast</div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <div className="page-wrap space-y-8">
        <Filter
          filters={[
            {
              key: 'timeRange',
              label: 'Time Range',
              placeholder: 'Select period',
              options: [
                { label: 'Last 3 months', value: '3m' },
                { label: 'Last 6 months', value: '6m' },
                { label: 'Last 12 months', value: '12m' },
                { label: 'Last 24 months', value: '24m' },
              ],
            },
            {
              key: 'region',
              label: 'Region',
              placeholder: 'All regions',
              options: [
                { label: 'North America', value: 'na' },
                { label: 'South America', value: 'sa' },
                { label: 'Europe', value: 'eu' },
                { label: 'Asia', value: 'asia' },
                { label: 'Africa', value: 'africa' },
              ],
            },
          ]}
          onApply={handleFilterApply}
        />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Events" value="247" icon="Data" color="blue" trend={{ direction: 'up', value: 34, label: 'vs previous year' }} />
          <StatCard label="Avg Severity" value="6.8" unit="/10" icon="Risk" color="red" trend={{ direction: 'down', value: 12, label: 'vs previous year' }} />
          <StatCard label="Peak Month" value="July" icon="Season" color="yellow" />
          <StatCard label="Most Common" value="Wildfire" icon="Pattern" color="purple" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Section
            title="Trendline overview"
            subtitle={`Historical sample trends for ${selectedRegion}.`}
          >
            <SeverityChart />
          </Section>

          <div className="space-y-4">
            <Alert variant="success" title="Positive Trend" closeable={false}>
              Critical events decreased by 15% compared with the previous quarter.
            </Alert>
            <Alert variant="warning" title="Seasonal Pattern" closeable={false}>
              Wildfire activity remains concentrated in hotter, drier months.
            </Alert>
            <Alert variant="info" title="Prediction" closeable={false}>
              Flood probability rises in Q2 under the current climate assumptions used in the MVP.
            </Alert>
          </div>
        </section>

        <Section
          title="Disaster type analysis"
          subtitle="These cards combine incident counts and trend direction into a format that reads well in both desktop demos and quick verbal walkthroughs."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {analysisCards.map((card) => (
              <div key={card.title} className="rounded-[24px] bg-white/35 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <span className="text-sm font-medium text-slate-500">{card.incidents} incidents</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/45">
                  <div className={`h-3 rounded-full bg-gradient-to-r ${card.bar}`} style={{ width: card.width }} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{card.trend}</p>
              </div>
            ))}
          </div>
        </Section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Section
            title="Model performance"
            subtitle="Lightweight ML framing that is easy to discuss without overpromising."
          >
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Accuracy</span><span className="font-semibold text-emerald-700">87.3%</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Precision</span><span className="font-semibold text-emerald-700">84.9%</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Recall</span><span className="font-semibold text-emerald-700">82.1%</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>F1 Score</span><span className="font-semibold text-emerald-700">83.5%</span></div>
            </div>
          </Section>

          <Section
            title="Training data"
            subtitle="Support data points for explaining model credibility in a simple, MVP-safe way."
          >
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Historical Events</span><span className="font-semibold text-slate-900">15,000+</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Features Used</span><span className="font-semibold text-slate-900">47</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Regions Covered</span><span className="font-semibold text-slate-900">180+</span></div>
              <div className="flex justify-between rounded-2xl bg-white/30 px-4 py-3"><span>Last Updated</span><span className="font-semibold text-slate-900">Demo Mode</span></div>
            </div>
          </Section>
        </section>
      </div>
    </>
  )
}
