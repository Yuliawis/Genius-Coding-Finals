import { useMemo, useState } from 'react'
import Hero from '../components/Common/Hero'
import Section from '../components/Common/Section'
import Input from '../components/Common/Input'
import Textarea from '../components/Common/Textarea'
import Select from '../components/Common/Select'
import Button from '../components/Common/Button'
import Alert from '../components/Common/Alert'
import Modal from '../components/Common/Modal'
import ImageUpload from '../components/HelpRequest/ImageUpload'

export default function HelpRequest() {
  const [formData, setFormData] = useState({
    disasterType: '',
    description: '',
    location: '',
    urgency: '',
    name: '',
    contact: '',
  })
  const [successModal, setSuccessModal] = useState(false)
  const [errors, setErrors] = useState({})

  const referenceId = useMemo(
    () => `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    [successModal],
  )

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
    setErrors({})
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

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return
    setSuccessModal(true)
    clearForm()
  }

  return (
    <>
      <Hero
        title="Human-centered support request flow"
        subtitle="Emergency Intake"
        description="Capture incident details, location, urgency, and photo evidence in a clear triage experience that still feels polished enough for a live hackathon demo."
      />

      <div className="page-wrap space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Section
            title="Emergency request form"
            subtitle="Every field is organized to keep the workflow fast, calm, and understandable during stressful moments."
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert variant="info" title="How this works" closeable={false}>
                The form records structured incident details for responders. A future backend can send the uploaded image to `/api/analyze` for severity scoring without changing the front-end flow.
              </Alert>

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
                <ImageUpload />
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
                <Button type="submit" size="lg" className="flex-1">
                  Submit Help Request
                </Button>
                <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={clearForm}>
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
                  <p className="mt-2 text-sm leading-6 text-slate-600">Supports future ML severity scoring without exposing API keys in the client.</p>
                </div>
              </div>
            </Section>
          </div>
        </section>

        <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="Request Submitted">
          <div className="space-y-4 text-center">
            <p className="text-slate-700">
              The request has been recorded in demo mode and is ready for the next backend integration step.
            </p>
            <p className="text-sm font-medium text-slate-600">
              Reference ID: <span className="font-semibold text-amber-700">{referenceId}</span>
            </p>
            <Button onClick={() => setSuccessModal(false)} className="w-full">
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </>
  )
}
