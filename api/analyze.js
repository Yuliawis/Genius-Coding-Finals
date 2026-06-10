import { scoreSeverityWithGemini } from './_lib/geminiSeverity.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body || {}

  const assessment = await scoreSeverityWithGemini({
    urgency: body.urgency,
    description: body.description,
    disasterType: body.disasterType,
    location: body.location,
    imageProvided: Boolean(body.imageBase64),
    imageBase64: body.imageBase64,
    imageMimeType: body.imageMimeType,
  })

  return res.status(200).json(assessment)
}
