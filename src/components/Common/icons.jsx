const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function AlertCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function UsersIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M16 14.2c2.3.4 4 2.4 4 4.8" />
    </svg>
  )
}

export function AlertTriangleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4 21 19H3z" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function GlobeIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  )
}

export function BookOpenIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 6c-1.8-1.3-4.2-2-6.5-2v13c2.3 0 4.7.7 6.5 2 1.8-1.3 4.2-2 6.5-2V4c-2.3 0-4.7.7-6.5 2z" />
      <line x1="12" y1="6" x2="12" y2="19" />
    </svg>
  )
}

export function StarIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3-5.4 3 1.3-6L3.3 9.2l6.1-.6z" />
    </svg>
  )
}

export function ShieldCheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

export function ChartBarIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="5" y1="20" x2="5" y2="11" />
      <line x1="12" y1="20" x2="12" y2="6" />
      <line x1="19" y1="20" x2="19" y2="14" />
    </svg>
  )
}

export function ActivityIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  )
}

export function CalendarIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="3" x2="8" y2="6.5" />
      <line x1="16" y1="3" x2="16" y2="6.5" />
    </svg>
  )
}

export function TrendingUpIcon(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="3,17 9,11 13,15 21,6" />
      <polyline points="14,6 21,6 21,13" />
    </svg>
  )
}

export const statIcons = {
  Watch: AlertCircleIcon,
  Scale: UsersIcon,
  Priority: AlertTriangleIcon,
  Map: GlobeIcon,
  Learn: BookOpenIcon,
  Points: StarIcon,
  Ready: ShieldCheckIcon,
  Data: ChartBarIcon,
  Risk: ActivityIcon,
  Season: CalendarIcon,
  Pattern: TrendingUpIcon,
}
