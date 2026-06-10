import { useState } from 'react'
import scenarios from '../../data/scenarios.json'
import ScenarioCard from './ScenarioCard'
import ScoreBoard from './ScoreBoard'
import Button from '../Common/Button'

const MAX_SCORE = scenarios.reduce((sum, scenario) => sum + scenario.points, 0)

function getTier(score) {
  const pct = score / MAX_SCORE
  if (pct >= 0.8) return 'Expert Responder'
  if (pct >= 0.5) return 'Aware Citizen'
  return 'Needs Preparation'
}

export default function GameEngine() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [finished, setFinished] = useState(false)

  const scenario = scenarios[index]

  function handleAnswer(choiceIndex) {
    if (answered !== null) return
    setAnswered(choiceIndex)
    if (choiceIndex === scenario.correct) {
      setScore((currentScore) => currentScore + scenario.points)
    }
  }

  function handleNext() {
    if (index + 1 >= scenarios.length) {
      setFinished(true)
    } else {
      setIndex((currentIndex) => currentIndex + 1)
      setAnswered(null)
    }
  }

  function handleRestart() {
    setIndex(0)
    setScore(0)
    setAnswered(null)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="glass-dark rounded-[32px] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Final Score</p>
        <p className="mt-4 text-6xl font-semibold text-white">
          {score}
          <span className="ml-2 text-2xl text-white/45">/ {MAX_SCORE}</span>
        </p>
        <p className="mt-4 text-xl font-medium text-amber-200">{getTier(score)}</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
          This mini-simulation helps judges see preparedness education in action. Restart to replay the scenarios and improve the outcome.
        </p>
        <div className="mt-6">
          <Button onClick={handleRestart}>Play Again</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ScoreBoard score={score} current={index + 1} total={scenarios.length} />
      <ScenarioCard
        scenario={scenario}
        answered={answered}
        onAnswer={handleAnswer}
        onNext={handleNext}
        isLast={index + 1 >= scenarios.length}
      />
    </>
  )
}
