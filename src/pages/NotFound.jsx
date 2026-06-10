import { Link } from 'react-router-dom'
import Section from '../components/Common/Section'
import Button from '../components/Common/Button'

export default function NotFound() {
  return (
    <div className="page-wrap pt-12">
      <Section
        title="This page drifted off the map"
        subtitle="The route could not be found, but the rest of the demo is still available."
        className="text-center"
      >
        <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600">
          Use the main navigation to return to the live experience, or jump directly back to the homepage from here.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </Section>
    </div>
  )
}
