import { buildReferenceId, validateHelpRequest } from './_lib/helpRequest.js'
import { scoreSeverityWithGemini } from './_lib/geminiSeverity.js'
import { insertHelpRequestRecord, isSupabaseConfigured } from './_lib/supabase.js'

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

    const referenceId = buildReferenceId()

    const severityAssessment = await scoreSeverityWithGemini({
      urgency: body.urgency,
      description: body.description,
      disasterType: body.disasterType,
      location: body.location,
      imageProvided: Boolean(body.imageBase64),
      imageBase64: body.imageBase64,
      imageMimeType: body.imageMimeType,
    })

    let database = {
      saved: false,
      provider: 'supabase',
      configured: isSupabaseConfigured(),
      rowId: null,
      error: null,
    }

    if (database.configured) {
      try {
        const insertedRow = await insertHelpRequestRecord({
          reference_id: referenceId,
          submitted_at: new Date().toISOString(),
          disaster_type: body.disasterType,
          description: body.description,
          location: body.location,
          urgency: body.urgency,
          requester_name: body.name,
          contact: body.contact,
          image_name: body.imageName || null,
          image_mime_type: body.imageMimeType || null,
          image_base64: body.imageBase64 || null,
          image_provided: Boolean(body.imageBase64),
          severity: severityAssessment.severity,
          severity_confidence: severityAssessment.confidence ?? null,
          analysis_source: severityAssessment.source || 'unknown',
          analysis_mode: severityAssessment.mode || 'unknown',
          routing_tag: severityAssessment.routingTag || null,
          response_window: severityAssessment.responseWindow || null,
          severity_message: severityAssessment.message || null,
          visible_indicators: severityAssessment.visibleIndicators || [],
          request_payload: {
            disasterType: body.disasterType,
            description: body.description,
            location: body.location,
            urgency: body.urgency,
            name: body.name,
            contact: body.contact,
            imageName: body.imageName || null,
            imageMimeType: body.imageMimeType || null,
            imageProvided: Boolean(body.imageBase64),
          },
          severity_assessment: severityAssessment,
        })

        database = {
          ...database,
          saved: true,
          rowId: insertedRow?.id || null,
        }
      } catch (databaseError) {
        database = {
          ...database,
          error: databaseError?.message || 'Supabase insert failed.',
        }
      }
    }

    const requestRecord = {
      referenceId,
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
      database,
    }

    return res.status(200).json(requestRecord)
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Request processing failed.',
    })
  }
}
