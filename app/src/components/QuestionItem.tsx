import type { Question } from '../data/questions';
import { OPTIONS } from '../utils/scoring';
import './QuestionItem.css';

interface Props {
  question: Question;
  selected: number | undefined;
  onChange: (questionId: number, optionIndex: number) => void;
}

export default function QuestionItem({ question, selected, onChange }: Props) {
  return (
    <div className="question-item">
      <p className="question-text">
        <span className="question-index">{question.id}.</span> {question.text}
      </p>
      <div className="options">
        {OPTIONS.map((label, index) => (
          <button
            key={index}
            className={`option-btn${selected === index ? ' selected' : ''}`}
            onClick={() => onChange(question.id, index)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
