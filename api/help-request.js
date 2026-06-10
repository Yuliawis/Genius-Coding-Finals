import { buildReferenceId, validateHelpRequest } from './_lib/helpRequest.js'
import { scoreSeverityWithGemini } from './_lib/geminiSeverity.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const body = req.body || {}
    const errors = validateHelpRequest(body)

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        errors,
      })
    }

    const severityAssessment = await scoreSeverityWithGemini({
      urgency: body.urgency,
      description: body.description,
      disasterType: body.disasterType,
      location: body.location,
      imageProvided: Boolean(body.imageBase64),
      imageBase64: body.imageBase64,
      imageMimeType: body.imageMimeType,
    })

    const requestRecord = {
      referenceId: buildReferenceId(),
      submittedAt: new Date().toISOString(),
      request: {
        disasterType: body.disasterType,
        description: body.description,
        location: body.location,
        urgency: body.urgency,
        name: body.name,
        contact: body.contact,
        imageName: body.imageName || null,
        imageProvided: Boolean(body.imageBase64),
      },
      severityAssessment,
      mode: severityAssessment.mode,
    }

    return res.status(200).json(requestRecord)
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Request processing failed.',
    })
  }
}
