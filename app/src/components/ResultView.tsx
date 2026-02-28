import './ResultView.css';

interface Props {
  score: number;
  levelLabel: string;
  onReset: () => void;
}

export default function ResultView({ score, levelLabel, onReset }: Props) {
  return (
    <div className="result-view">
      <h1 className="result-title">评估结果</h1>
      <div className="score-card">
        <div className="score-number">{score}</div>
        <div className="score-unit">分</div>
      </div>
      <div className="level-badge">{levelLabel}</div>
      <p className="score-range">满分 160 分｜低熵 32-64｜中熵 65-127｜高熵 128-160</p>
      <button className="reset-btn" onClick={onReset} type="button">
        重新评估
      </button>
    </div>
  );
}
