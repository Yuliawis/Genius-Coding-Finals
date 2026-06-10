export const severityOrder = ['low', 'medium', 'high', 'critical']

export function clampSeverity(severity) {
  if (severityOrder.includes(severity)) return severity
  return 'medium'
}

export function getResponseWindow(severity) {
  return {
    low: 'Within 24 hours',
    medium: 'Within 6 hours',
    high: 'Within 2 hours',
    critical: 'Immediate escalation',
  }[clampSeverity(severity)]
}

export function buildRoutingTag(severity) {
  return `${clampSeverity(severity).toUpperCase()}-QUEUE`
}

export function assessRequestSeverity({
  urgency = 'medium',
  description = '',
  disasterType = '',
  imageProvided = false,
}) {
  const normalizedUrgency = clampSeverity(String(urgency).toLowerCase())
  const text = String(description).toLowerCase()
  const type = String(disasterType).toLowerCase()

  let score = severityOrder.indexOf(normalizedUrgency) + 1

  const criticalKeywords = ['trapped', 'injured', 'collapsed', 'fire spreading', 'can not breathe', 'missing', 'flooding fast']
  const highKeywords = ['evacuate', 'damage', 'destroyed', 'blocked', 'urgent', 'medical', 'power outage', 'unsafe']

  if (criticalKeywords.some((keyword) => text.includes(keyword))) score += 2
  if (highKeywords.some((keyword) => text.includes(keyword))) score += 1
  if (imageProvided) score += 1
  if (['earthquake', 'wildfire', 'hurricane', 'flood'].includes(type)) score += 1

  const boundedScore = Math.min(score, 4)
  const severity = severityOrder[boundedScore - 1]

  return {
    severity,
    confidence: imageProvided ? 0.82 : 0.68,
    responseWindow: getResponseWindow(severity),
    routingTag: buildRoutingTag(severity),
    message: imageProvided
      ? 'Photo attached. Demo severity review included in request routing.'
      : 'No photo attached. Severity estimated from the submitted form details.',
  }
}

export function validateHelpRequest(payload = {}) {
  const errors = {}

  if (!payload.disasterType) errors.disasterType = 'Disaster type is required.'
  if (!payload.description || String(payload.description).trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.'
  }
  if (!payload.location) errors.location = 'Location is required.'
  if (!payload.urgency) errors.urgency = 'Urgency is required.'
  if (!payload.name) errors.name = 'Name is required.'
  if (!payload.contact) errors.contact = 'Contact information is required.'

  return errors
}

export function buildReferenceId() {
  return `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}
