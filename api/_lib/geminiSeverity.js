import {
  assessRequestSeverity,
  buildRoutingTag,
  clampSeverity,
  getResponseWindow,
} from './helpRequest.js'

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

function clampConfidence(value, fallback) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.max(0, Math.min(1, value))
}

function extractTextFromGeminiResponse(payload = {}) {
  const parts = payload?.candidates?.[0]?.content?.parts || []
  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('\n')
    .trim()
}

function extractJsonBlock(text) {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i)
  if (fencedMatch) return fencedMatch[1].trim()

  const objectMatch = text.match(/\{[\s\S]*\}/)
  return objectMatch ? objectMatch[0] : ''
}

function buildGeminiPrompt({ disasterType, description, location, urgency }) {
  return [
    'You are a disaster response triage assistant.',
    'Analyze the attached image together with the provided incident details.',
    'Return only valid JSON with this exact shape:',
    '{"severity":"low|medium|high|critical","confidence":0.0,"rationale":"short sentence","visibleIndicators":["item 1","item 2"]}',
    'Base severity on visible damage, apparent danger, scale of impact, and alignment with the text details.',
    'Use a higher severity only when the visual evidence clearly supports it.',
    `Disaster type: ${disasterType || 'Unknown'}`,
    `Location: ${location || 'Unknown'}`,
    `Urgency selected by user: ${urgency || 'Unknown'}`,
    `Description: ${description || 'No description provided.'}`,
  ].join('\n')
}

function buildFallbackAssessment(input, reason) {
  const fallback = assessRequestSeverity(input)

  return {
    ...fallback,
    mode: 'demo',
    source: 'fallback',
    model: null,
    visibleIndicators: [],
    message: reason || fallback.message,
  }
}

export async function scoreSeverityWithGemini({
  urgency = 'medium',
  description = '',
  disasterType = '',
  location = '',
  imageProvided = false,
  imageBase64 = '',
  imageMimeType = 'image/jpeg',
}) {
  const fallbackInput = {
    urgency,
    description,
    disasterType,
    imageProvided,
  }

  if (!imageBase64) {
    return buildFallbackAssessment(
      fallbackInput,
      'No image attached. Severity estimated from the submitted form details.'
    )
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return buildFallbackAssessment(
      fallbackInput,
      'Gemini API key not configured. Severity estimated with the built-in fallback rules.'
    )
  }

  try {
    const normalizedMimeType = 'image/jpeg'

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: buildGeminiPrompt({ disasterType, description, location, urgency }) },
                {
                  inline_data: {
                    mime_type: normalizedMimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini request failed: ${response.status} ${errorText}`)
    }

    const payload = await response.json()
    const rawText = extractTextFromGeminiResponse(payload)
    const jsonText = extractJsonBlock(rawText)

    if (!jsonText) {
      throw new Error('Gemini did not return JSON content.')
    }

    const parsed = JSON.parse(jsonText)
    const severity = clampSeverity(String(parsed?.severity || '').toLowerCase())
    const visibleIndicators = Array.isArray(parsed?.visibleIndicators)
      ? parsed.visibleIndicators.filter((item) => typeof item === 'string' && item.trim())
      : []

    return {
      severity,
      confidence: clampConfidence(parsed?.confidence, 0.88),
      responseWindow: getResponseWindow(severity),
      routingTag: buildRoutingTag(severity),
      message: parsed?.rationale || 'Gemini reviewed the uploaded image and incident details.',
      visibleIndicators,
      mode: 'gemini',
      source: 'gemini',
      model: DEFAULT_MODEL,
    }
  } catch (error) {
    return buildFallbackAssessment(
      fallbackInput,
      `Gemini analysis was unavailable. ${error.message || 'Fallback severity rules were used instead.'}`
    )
  }
}
