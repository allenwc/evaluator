import { useState } from 'react';
import type { MainDimensionResult, SubDimensionResult } from '../utils/scoring';
import PentagonChart from './PentagonChart';
import EntropyTypeCard from './EntropyTypeCard';
import './ResultView.css';

interface Props {
  score: number;
  levelLabel: string;
  mainDimensions: MainDimensionResult[];
  subDimensions: SubDimensionResult[];
  onReset: () => void;
}

export default function ResultView({ score, levelLabel, mainDimensions, subDimensions, onReset }: Props) {
  const [showTypeCard, setShowTypeCard] = useState(false);

  return (
    <div className="result-view">
      <h1 className="result-title">评估结果</h1>

      {/* 总熵值 */}
      <div className="score-card">
        <div className="score-number">{score}</div>
        <div className="score-unit">分</div>
      </div>
      <div className="level-badge">{levelLabel}</div>
      <p className="score-range">满分 160 分｜低熵 32-64｜中熵 65-127｜高熵 128-160</p>

      {/* 主维度 */}
      <div className="section">
        <h2 className="section-title">主维度</h2>
        <div className="main-dimensions">
          {mainDimensions.map(dim => (
            <div key={dim.label} className="main-dim-card">
              <div className="main-dim-label">{dim.label}</div>
              <div className="main-dim-score">{dim.score}<span className="main-dim-unit">分</span></div>
              <div className="main-dim-badge">{dim.tendencyLabel}{dim.tendencyDesc}</div>
              <div className="main-dim-hint">（满分80分，阈值40分）</div>
            </div>
          ))}
        </div>
      </div>

      {/* 五向熵维图 */}
      <div className="section">
        <h2 className="section-title">五向熵维图</h2>
        <p className="section-desc">各子维度得分（1-5分）</p>
        <div className="pentagon-wrap">
          <PentagonChart dimensions={subDimensions} />
        </div>
      </div>

      {/* 查看熵型 */}
      <button
        className="type-btn"
        onClick={() => setShowTypeCard(true)}
        type="button"
      >
        查看我的熵型
      </button>

      <button className="reset-btn" onClick={onReset} type="button">
        重新评估
      </button>

      {showTypeCard && (
        <EntropyTypeCard
          mainDimensions={mainDimensions}
          onClose={() => setShowTypeCard(false)}
        />
      )}
    </div>
  );
}
