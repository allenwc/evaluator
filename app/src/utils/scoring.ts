import { questions, ENTROPY_LEVELS } from '../data/questions';

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
