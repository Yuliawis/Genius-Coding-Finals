import { useState } from 'react'
import questionsCsv from '../../../questions_list.csv?raw'
import ScenarioCard from './ScenarioCard'
import ScoreBoard from './ScoreBoard'
import Button from '../Common/Button'

const QUIZ_SIZE = 8

function parseCsvLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const nextChar = line[index + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values
}

function parseQuestionBank(csvText) {
  const lines = csvText.trim().split(/\r?\n/)
  const headers = parseCsvLine(lines[0])

  return lines.slice(1).map((line) => {
    const columns = parseCsvLine(line)
    const row = Object.fromEntries(headers.map((header, index) => [header, columns[index] ?? '']))
    const correctLetter = String(row['Correct Answer'] || '').trim().toUpperCase()
    const correct = { A: 0, B: 1, C: 2 }[correctLetter] ?? 0

    return {
      id: row['Question ID'],
      category: row.Category,
      difficulty: row.Difficulty,
      points: Number(row.Points) || 10,
      situation: row.Question,
      choices: [row['Option A'], row['Option B'], row['Option C']].filter(Boolean),
      correct,
      explanation: row['Rationale / Explanation'],
    }
  })
}

function shuffle(array) {
  const items = [...array]

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[items[index], items[swapIndex]] = [items[swapIndex], items[index]]
  }

  return items
}

const questionBank = parseQuestionBank(questionsCsv)

function createScenarioSet() {
  return shuffle(questionBank).slice(0, QUIZ_SIZE)
}

function getTier(score, maxScore) {
  const pct = maxScore > 0 ? score / maxScore : 0
  if (pct >= 0.8) return 'Expert Responder'
  if (pct >= 0.5) return 'Aware Citizen'
  return 'Needs Preparation'
}

export default function GameEngine() {
  const [scenarios, setScenarios] = useState(() => createScenarioSet())
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [finished, setFinished] = useState(false)

  const maxScore = scenarios.reduce((sum, scenario) => sum + scenario.points, 0)
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
    setScenarios(createScenarioSet())
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
          <span className="ml-2 text-2xl text-white/45">/ {maxScore}</span>
        </p>
        <p className="mt-4 text-xl font-medium text-amber-200">{getTier(score, maxScore)}</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
          This mini-simulation now draws a fresh random set from the 200-question preparedness bank each time you play.
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
