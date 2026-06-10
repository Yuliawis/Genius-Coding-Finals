export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  // TODO: replace with real AI call using process.env.GEMINI_API_KEY
  return res.status(200).json({ severity: 'moderate', message: 'demo mode' })
}
