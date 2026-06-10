import { useState } from 'react'
import Hero from '../components/Common/Hero'
import Section from '../components/Common/Section'
import Input from '../components/Common/Input'
import Textarea from '../components/Common/Textarea'
import Select from '../components/Common/Select'
import Button from '../components/Common/Button'
import Alert from '../components/Common/Alert'
import Modal from '../components/Common/Modal'
import ImageUpload from '../components/HelpRequest/ImageUpload'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}

async function parseApiResponse(response) {
  const rawText = await response.text()

  if (!rawText) {
    return {
      data: null,
      errorMessage: 'The server returned an empty response. Please try again later.',
    }
  }

  try {
    return {
      data: JSON.parse(rawText),
      errorMessage: '',
    }
  } catch {
    return {
      data: null,
      errorMessage: `The server returned invalid JSON: ${rawText.slice(0, 160)}`,
    }
  }
}

export default function HelpRequest() {
  const [formData, setFormData] = useState({
    disasterType: '',
    description: '',
    location: '',
    urgency: '',
    name: '',
    contact: '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [successModal, setSuccessModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const disasterOptions = [
    { label: 'Wildfire', value: 'wildfire' },
    { label: 'Flood', value: 'flood' },
    { label: 'Earthquake', value: 'earthquake' },
    { label: 'Hurricane', value: 'hurricane' },
    { label: 'Landslide', value: 'landslide' },
    { label: 'Other', value: 'other' },
  ]

  const urgencyOptions = [
    { label: 'Low - General information needed', value: 'low' },
    { label: 'Medium - Some assistance needed', value: 'medium' },
    { label: 'High - Urgent help required', value: 'high' },
    { label: 'Critical - Immediate emergency', value: 'critical' },
  ]

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const clearForm = () => {
    setFormData({
      disasterType: '',
      description: '',
      location: '',
      urgency: '',
      name: '',
      contact: '',
    })
    setSelectedFile(null)
    setErrors({})
    setSubmitError('')
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.disasterType) nextErrors.disasterType = 'Please select a disaster type'
    if (!formData.description || formData.description.length < 10) nextErrors.description = 'Please describe the situation in at least 10 characters'
    if (!formData.location) nextErrors.location = 'Please enter your location'
    if (!formData.name) nextErrors.name = 'Please enter your name'
    if (!formData.contact) nextErrors.contact = 'Please enter your contact information'
    if (!formData.urgency) nextErrors.urgency = 'Please select an urgency level'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const imageBase64 = selectedFile ? await fileToBase64(selectedFile) : null

      const payload = {
        ...formData,
        imageName: selectedFile?.name || null,
        imageMimeType: selectedFile?.type || null,
        imageBase64,
      }

      const response = await fetch('/api/help-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const { data, errorMessage } = await parseApiResponse(response)

      if (!response.ok) {
        if (data?.errors) {
          setErrors(data.errors)
        }
        throw new Error(data?.error || errorMessage || 'Request submission failed.')
      }

      if (!data) {
        throw new Error(errorMessage || 'The server returned an unreadable response.')
      }

      setResult(data)
      setSuccessModal(true)
      clearForm()
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong while submitting your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Hero
        title="Human-centered support request flow"
        subtitle="Emergency Intake"
        description="Capture incident details, location, urgency, and photo evidence in a clear triage experience that still feels polished enough for a live hackathon demo."
        image={
          <div className="glass-panel-strong relative space-y-3 rounded-[28px] p-6">
            <div className="flex items-center justify-between rounded-3xl bg-white/50 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Step 1</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Describe the situation</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-3xl bg-white/50 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Step 2</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Add a photo</p>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950/85 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Step 3</p>
              <p className="mt-1 text-lg font-semibold">AI severity scoring routes your request</p>
            </div>
          </div>
        }
      />

      <div className="page-wrap space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Section
            title="Emergency request form"
            subtitle="Every field is organized to keep the workflow fast, calm, and understandable during stressful moments."
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert variant="info" title="How this works" closeable={false}>
                The backend validates the form, sends any uploaded image to Gemini for severity scoring, and can store the submitted request in Supabase.
              </Alert>

              {submitError && (
                <Alert variant="error" title="Submission issue" closeable={false}>
                  {submitError}
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Type of Disaster"
                  name="disasterType"
                  value={formData.disasterType}
                  onChange={handleChange}
                  options={disasterOptions}
                  placeholder="Select the type of disaster"
                  error={errors.disasterType}
                />
                <Select
                  label="Urgency Level"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  options={urgencyOptions}
                  placeholder="Choose urgency"
                  error={errors.urgency}
                />
              </div>

              <Input
                label="Your Location"
                name="location"
                type="text"
                placeholder="City, region, country"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />

              <Textarea
                label="Describe Your Situation"
                name="description"
                rows={6}
                placeholder="Explain damage, safety risks, immediate needs, injuries, access issues, or other critical details."
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Damage Photo</label>
                <ImageUpload
                  fileName={selectedFile?.name || ''}
                  onFileChange={setSelectedFile}
                  analysisHint={selectedFile ? 'Image will be sent to the API for Gemini severity scoring.' : ''}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Your Name"
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  label="Contact Information"
                  name="contact"
                  type="text"
                  placeholder="Phone or email"
                  value={formData.contact}
                  onChange={handleChange}
                  error={errors.contact}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
                  {submitting ? 'Submitting Request...' : 'Submit Help Request'}
                </Button>
                <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={clearForm} disabled={submitting}>
                  Clear Form
                </Button>
              </div>
            </form>
          </Section>

          <div className="space-y-6">
            <div className="glass-dark rounded-[32px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Triage Intent</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Fast, explainable intake</h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                This page is designed to show how the product turns raw community reports into something responders can quickly assess and prioritize.
              </p>
            </div>

            <Section title="What responders need" subtitle="These prompt cards help explain the purpose of the form fields during the demo.">
              <div className="grid gap-4">
                <div className="rounded-[24px] bg-white/35 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">Location precision</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Improves routing, dispatch, and local risk context immediately.</p>
                </div>
                <div className="rounded-[24px] bg-white/35 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">Urgency signal</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Lets responders sort between guidance requests and life-threatening cases.</p>
                </div>
                <div className="rounded-[24px] bg-white/35 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">Image evidence</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">The uploaded image is analyzed by Gemini for severity scoring, with a local fallback if the API is unavailable.</p>
                </div>
              </div>
            </Section>
          </div>
        </section>

        <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="Request Submitted">
          <div className="space-y-4 text-center">
            <p className="text-slate-700">
              Your request has been recorded and routed through the backend intake flow.
            </p>
            {result && (
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-left text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Reference ID:</span> {result.referenceId}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">Severity:</span> {result.severityAssessment?.severity}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">Analysis Source:</span> {result.severityAssessment?.source}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">Routing:</span> {result.severityAssessment?.routingTag}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">Response Window:</span> {result.severityAssessment?.responseWindow}</p>
                <p className="mt-2"><span className="font-semibold text-slate-900">Saved to Database:</span> {result.database?.saved ? 'Yes' : 'No'}</p>
                {result.database?.rowId && (
                  <p className="mt-2"><span className="font-semibold text-slate-900">Supabase Row ID:</span> {result.database.rowId}</p>
                )}
                {result.database?.error && (
                  <p className="mt-2"><span className="font-semibold text-slate-900">Database Note:</span> {result.database.error}</p>
                )}
              </div>
            )}
            <Button onClick={() => setSuccessModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </>
  )
}
