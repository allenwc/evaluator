import type { SubDimensionResult } from '../utils/scoring';

interface Props {
  dimensions: SubDimensionResult[];
}

const W = 340;
const H = 300;
const CX = 170;
const CY = 155;
const MAX_R = 100;
const LABEL_R = MAX_R + 32;
const LEVELS = 5;

// 顶点顺序（顺时针从顶部）：封闭性、高线性、能量失焦、内心失序、平衡态
const ANGLES = [0, 1, 2, 3, 4].map(i => (i * 72 - 90) * (Math.PI / 180));

function point(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function polygonPoints(values: number[]) {
  return values
    .map((v, i) => {
      const r = (v / LEVELS) * MAX_R;
      const p = point(ANGLES[i], r);
      return `${p.x},${p.y}`;
    })
    .join(' ');
}

function gridPoints(level: number) {
  const r = (level / LEVELS) * MAX_R;
  return ANGLES.map(a => {
    const p = point(a, r);
    return `${p.x},${p.y}`;
  }).join(' ');
}

// 根据顶点位置决定文字对齐方式
function textAnchor(x: number): 'middle' | 'start' | 'end' {
  if (Math.abs(x - CX) < 8) return 'middle';
  return x < CX ? 'end' : 'start';
}

export default function PentagonChart({ dimensions }: Props) {
  // 固定顺序：封闭性、高线性、能量失焦、内心失序、平衡态
  const ORDER = ['closure', 'linearity', 'energyLoss', 'innerChaos', 'balance'];
  const ordered = ORDER.map(key => dimensions.find(d => d.key === key)!);
  const values = ordered.map(d => d?.score ?? 0);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* 背景网格 */}
      {[1, 2, 3, 4, 5].map(level => (
        <polygon
          key={level}
          points={gridPoints(level)}
          fill="none"
          stroke="#e8e8e8"
          strokeWidth="1"
        />
      ))}

      {/* 轴线 */}
      {ANGLES.map((angle, i) => {
        const p = point(angle, MAX_R);
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={p.x} y2={p.y}
            stroke="#e8e8e8"
            strokeWidth="1"
          />
        );
      })}

      {/* 用户数据区域 */}
      <polygon
        points={polygonPoints(values)}
        fill="rgba(79, 134, 247, 0.18)"
        stroke="#4f86f7"
        strokeWidth="2"
      />

      {/* 顶点圆点 */}
      {values.map((v, i) => {
        const r = (v / LEVELS) * MAX_R;
        const p = point(ANGLES[i], r);
        return (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#4f86f7" />
        );
      })}

      {/* 标签：维度名 + 得分 */}
      {ordered.map((d, i) => {
        const p = point(ANGLES[i], LABEL_R);
        const anchor = textAnchor(p.x);
        // 顶部顶点文字往上偏移，底部顶点文字往下偏移
        const isTop = p.y < CY;
        const nameY = isTop ? p.y - 10 : p.y + 4;
        const scoreY = isTop ? p.y + 8 : p.y + 20;

        return (
          <g key={i}>
            <text
              x={p.x}
              y={nameY}
              textAnchor={anchor}
              fontSize="12"
              fill="#555"
            >
              {d?.label}
            </text>
            <text
              x={p.x}
              y={scoreY}
              textAnchor={anchor}
              fontSize="12"
              fontWeight="600"
              fill="#4f86f7"
            >
              {d?.score.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
