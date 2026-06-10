import Button from './Button'

export default function Hero({
  title = '',
  subtitle = '',
  description = '',
  cta = null,
  image = null,
  className = '',
}) {
  return (
    <section className={`page-wrap pb-8 pt-8 ${className}`}>
      <div className="glass-card overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            {subtitle && (
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                {subtitle}
              </p>
            )}
            {title && (
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {description}
              </p>
            )}
            {cta && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {Array.isArray(cta) ? (
                  cta.map((button) => (
                    <Button key={button.label} variant={button.variant} size="lg" onClick={button.onClick}>
                      {button.label}
                    </Button>
                  ))
                ) : (
                  <Button size="lg" onClick={cta.onClick}>
                    {cta.label}
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/40 via-white/10 to-transparent" />
            {image ? (
              <div className="relative">{image}</div>
            ) : (
              <div className="glass-panel-strong relative rounded-[28px] p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/50 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Signal</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">24/7</p>
                    <p className="mt-1 text-sm text-slate-600">Monitoring readiness</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/85 p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Forecast</p>
                    <p className="mt-3 text-3xl font-semibold">AI</p>
                    <p className="mt-1 text-sm text-white/70">Decision support</p>
                  </div>
                  <div className="col-span-2 rounded-3xl bg-white/40 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mission</p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">Prepared communities, faster response</p>
                      </div>
                      <div className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-700">
                        Demo ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
