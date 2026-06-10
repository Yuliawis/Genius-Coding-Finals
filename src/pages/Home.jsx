import { useNavigate } from 'react-router-dom'
import Button from '../components/Common/Button'

export default function Home() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[calc(100vh-96px)] overflow-hidden px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-[#f6d5be]/80 blur-3xl" />
        <div className="absolute right-[-8%] top-[8%] h-[32rem] w-[32rem] rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-[-14%] left-[24%] h-[30rem] w-[30rem] rounded-full bg-[#f1dfd4]/85 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-7xl items-center">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.98fr] lg:items-center">
          <div className="space-y-9">
            <p className="text-xs uppercase tracking-[0.36em] text-slate-500">
              Climate-Aware Disaster Intelligence
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-[4.2rem] lg:leading-[1.12]">
              A calmer way to
              <br />
              <span className="rounded-[20px] bg-[#d7dbff] px-3 pb-0.5 pt-0">understand disasters</span>
              <br />
              and
              {' '}
              <span className="rounded-[20px] bg-[#d7dbff] px-3 pb-0.5 pt-0">support people faster</span>
              .
            </h1>

            <p className="max-w-2xl text-lg leading-9 text-slate-600">
              Eco Response Hub helps communities, responders, and decision-makers see urgent events more clearly, prepare with confidence, and coordinate support through one polished environmental response platform.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="xl" onClick={() => navigate('/dashboard')}>
                Open Dashboard
              </Button>
              <Button variant="secondary" size="xl" onClick={() => navigate('/help')}>
                Request Help
              </Button>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[560px]">
            <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.96),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(246,223,208,0.94),transparent_42%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(148,163,184,0.18)_1.1px,transparent_1.1px)] bg-[length:34px_34px] opacity-35" />

            <div className="absolute left-[12%] top-[17%] h-14 w-36 rounded-full bg-white/45 backdrop-blur-sm" />
            <div className="absolute right-[10%] top-[25%] h-10 w-48 rounded-full bg-[#c5c9ff] shadow-[0_0_40px_rgba(197,201,255,0.28)]" />

            <div className="absolute left-[18%] top-[33%] h-24 w-24 rounded-[32px] bg-[#f6c38b] shadow-[0_0_50px_rgba(246,195,139,0.24)]" />
            <div className="absolute left-[28%] top-[40%] h-16 w-36 rounded-[28px] bg-[#f6c38b] shadow-[0_0_50px_rgba(246,195,139,0.22)]" />
            <div className="absolute left-[43%] top-[33%] h-24 w-24 rounded-[32px] bg-[#f6c38b] shadow-[0_0_50px_rgba(246,195,139,0.24)]" />

            <div className="absolute right-[17%] top-[47%] h-24 w-24 rounded-[32px] bg-[#c5c9ff] shadow-[0_0_40px_rgba(197,201,255,0.24)]" />
            <div className="absolute right-[28%] top-[55%] h-16 w-28 rounded-[26px] bg-[#c5c9ff] shadow-[0_0_40px_rgba(197,201,255,0.2)]" />
            <div className="absolute right-[11%] top-[61%] h-24 w-24 rounded-[32px] bg-[#c5c9ff] shadow-[0_0_40px_rgba(197,201,255,0.24)]" />

            <div className="absolute left-[26%] bottom-[16%] h-24 w-24 rounded-full border border-white/40 bg-white/32 backdrop-blur-sm" />
            <div className="absolute left-[38%] bottom-[19%] h-14 w-24 rounded-full bg-white/38 backdrop-blur-sm" />
            <div className="absolute left-[47%] bottom-[13%] h-24 w-24 rounded-full border border-white/40 bg-white/32 backdrop-blur-sm" />

            <div className="absolute bottom-[12%] right-[20%] h-28 w-28 rounded-[34px] bg-white/36 backdrop-blur-sm" />
            <div className="absolute bottom-[18%] right-[30%] h-12 w-24 rounded-full bg-[#f6c38b]/80 shadow-[0_0_30px_rgba(246,195,139,0.18)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
