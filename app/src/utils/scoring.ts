import { questions, ENTROPY_LEVELS, MAIN_DIMENSIONS, SUB_DIMENSIONS } from '../data/questions';

export const OPTIONS = ['完全不符', '不太符合', '一般', '比较符合', '完全符合'] as const;

export function calculateScore(answers: Record<number, number>): number {
  return questions.reduce((total, q) => {
    const optionIndex = answers[q.id];
    return total + (optionIndex !== undefined ? q.scores[optionIndex] : 0);
  }, 0);
}

export function getEntropyLevel(score: number): string {
  for (const level of Object.values(ENTROPY_LEVELS)) {
    if (score >= level.min && score <= level.max) {
      return level.label;
    }
  }
  return '未知';
}

// 单个题目得分
function getQuestionScore(id: number, answers: Record<number, number>): number {
  const q = questions.find(q => q.id === id);
  if (!q) return 0;
  const optionIndex = answers[id];
  return optionIndex !== undefined ? q.scores[optionIndex] : 0;
}

// 主维度计算
export interface MainDimensionResult {
  label: string;
  score: number;
  tendencyLabel: string;
  tendencyDesc: string;
}

export function calculateMainDimensions(answers: Record<number, number>): MainDimensionResult[] {
  return Object.values(MAIN_DIMENSIONS).map(dim => {
    const score = dim.ids.reduce((sum, id) => sum + getQuestionScore(id, answers), 0);
    const isAbove = score >= dim.threshold;
    return {
      label: dim.label,
      score,
      tendencyLabel: isAbove ? dim.aboveLabel : dim.belowLabel,
      tendencyDesc: isAbove ? dim.aboveDesc : dim.belowDesc,
    };
  });
}

// 子维度计算
export interface SubDimensionResult {
  key: string;
  label: string;
  score: number; // 1-5
}

export function calculateSubDimensions(answers: Record<number, number>): SubDimensionResult[] {
  return SUB_DIMENSIONS.map(dim => {
    const total = dim.ids.reduce((sum, id) => sum + getQuestionScore(id, answers), 0);
    const score = Math.round((total / dim.ids.length) * 10) / 10;
    return { key: dim.key, label: dim.label, score };
  });
}
