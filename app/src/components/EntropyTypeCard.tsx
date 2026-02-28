import { useState } from 'react';
import type { MainDimensionResult } from '../utils/scoring';
import './EntropyTypeCard.css';

interface Props {
  mainDimensions: MainDimensionResult[];
  onClose: () => void;
}

const ENTROPY_TYPES = {
  dolphin: {
    name: '海豚型',
    emoji: '🐬',
    tags: ['成长型思维', '增效型做功'],
    tagColors: ['#4f86f7', '#34c98a'],
    desc: '你拥有开放灵活的思维方式，同时能高效转化自身能量。如海豚般智慧而充满活力，善于在变化中保持行动力，是高熵能量的理想状态。',
    bg: 'linear-gradient(135deg, #e8f4fd 0%, #dff0ea 100%)',
    accent: '#4f86f7',
  },
  sloth: {
    name: '树懒型',
    emoji: '🦥',
    tags: ['成长型思维', '内耗型做功'],
    tagColors: ['#4f86f7', '#f7a94f'],
    desc: '你拥有接纳成长的开放心态，但内在能量在转化中有较多损耗。如树懒般从容，潜力充足，关注提升行动效率，能量便能更好地流动。',
    bg: 'linear-gradient(135deg, #e8f4fd 0%, #fef3e2 100%)',
    accent: '#f7a94f',
  },
  rhino: {
    name: '犀牛型',
    emoji: '🦏',
    tags: ['固化型思维', '增效型做功'],
    tagColors: ['#f76f4f', '#34c98a'],
    desc: '你执行力强、目标明确，行动高效有力。如犀牛般稳健冲劲十足，若能拓展对未知变化的包容度，将释放更大的成长空间。',
    bg: 'linear-gradient(135deg, #fdeee8 0%, #dff0ea 100%)',
    accent: '#34c98a',
  },
  seasquirt: {
    name: '海鞘型',
    emoji: '🪸',
    tags: ['固化型思维', '内耗型做功'],
    tagColors: ['#f76f4f', '#f7a94f'],
    desc: '你当前的能量系统较为封闭，内在消耗较高。这是觉察的起点——海鞘虽静，仍在生长。此刻的觉知，已是改变的开始。',
    bg: 'linear-gradient(135deg, #fdeee8 0%, #fef3e2 100%)',
    accent: '#f76f4f',
  },
} as const;

type EntropyTypeKey = keyof typeof ENTROPY_TYPES;

function getEntropyTypeKey(mainDimensions: MainDimensionResult[]): EntropyTypeKey {
  const closure = mainDimensions.find(d => d.label === '封闭程度');
  const resistance = mainDimensions.find(d => d.label === '做功阻力');
  const isGrowth = closure?.tendencyLabel === '成长型';
  const isEfficient = resistance?.tendencyLabel === '增效型';
  if (isGrowth && isEfficient) return 'dolphin';
  if (isGrowth && !isEfficient) return 'sloth';
  if (!isGrowth && isEfficient) return 'rhino';
  return 'seasquirt';
}

export default function EntropyTypeCard({ mainDimensions, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const key = getEntropyTypeKey(mainDimensions);
  const type = ENTROPY_TYPES[key];

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 300);
  }

  return (
    <div className={`entropy-overlay ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <div
        className={`entropy-card ${closing ? 'closing' : ''}`}
        style={{ background: type.bg }}
        onClick={e => e.stopPropagation()}
      >
        <button className="entropy-close" onClick={handleClose} type="button">✕</button>

        <div className="entropy-emoji">{type.emoji}</div>

        <div className="entropy-name" style={{ color: type.accent }}>{type.name}</div>

        <div className="entropy-tags">
          {type.tags.map((tag, i) => (
            <span
              key={tag}
              className="entropy-tag"
              style={{ color: type.tagColors[i], borderColor: type.tagColors[i] }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="entropy-desc">{type.desc}</p>
      </div>
    </div>
  );
}
