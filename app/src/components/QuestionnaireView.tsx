import { useState } from 'react';
import { questions } from '../data/questions';
import { calculateScore, getEntropyLevel, calculateMainDimensions, calculateSubDimensions } from '../utils/scoring';
import QuestionItem from './QuestionItem';
import ResultView from './ResultView';
import './QuestionnaireView.css';

export default function QuestionnaireView() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{
    score: number;
    levelLabel: string;
    mainDimensions: ReturnType<typeof calculateMainDimensions>;
    subDimensions: ReturnType<typeof calculateSubDimensions>;
  } | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function handleChange(questionId: number, optionIndex: number) {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleSubmit() {
    const score = calculateScore(answers);
    const levelLabel = getEntropyLevel(score);
    const mainDimensions = calculateMainDimensions(answers);
    const subDimensions = calculateSubDimensions(answers);
    setResult({ score, levelLabel, mainDimensions, subDimensions });
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
  }

  if (result) {
    return (
      <ResultView
        score={result.score}
        levelLabel={result.levelLabel}
        mainDimensions={result.mainDimensions}
        subDimensions={result.subDimensions}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="questionnaire-view">
      <header className="questionnaire-header">
        <h1>多维熵值评估</h1>
        <p className="progress-text">已完成 {answeredCount} / {questions.length} 题</p>
      </header>
      <div className="question-list">
        {questions.map(q => (
          <QuestionItem
            key={q.id}
            question={q}
            selected={answers[q.id]}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="submit-area">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!allAnswered}
          type="button"
        >
          {allAnswered ? '提交评估' : `还有 ${questions.length - answeredCount} 题未作答`}
        </button>
      </div>
    </div>
  );
}
