## Why

现有结果页仅展示总熵值和熵段，缺乏对用户心理状态的深层解读。根据量表设计，题目可映射到两个主维度（封闭程度、做功阻力）和五个子维度（封闭性、平衡态、高线性、内心失序、能量失焦），在结果页补充这两套计算并以五向熵维图可视化展示，能让用户获得更有价值的自我认知参考。

## What Changes

- 新增两个主维度得分计算：封闭程度（题1-8、17-24）和做功阻力（题9-16、25-32），并显示对应思维/做功倾向标签
- 新增五个子维度得分计算（各题得分之和 ÷ 题数，结果为1-5分）
- 新增五向熵维图（五边形雷达图），将5个子维度得分可视化展示
- 结果页依次展示：总熵值 → 主维度得分 → 五向熵维图

## Capabilities

### New Capabilities

- `dimension-calculation`: 两个主维度（封闭程度、做功阻力）及五个子维度（封闭性、平衡态、高线性、内心失序、能量失焦）的得分计算逻辑，数据配置存放于 `src/data/questions.ts`
- `pentagon-chart`: 基于五个子维度得分渲染五边形雷达图（SVG 实现，无需引入图表库）
- `result-dimensions-display`: 结果页新增主维度得分区块和五向熵维图区块的展示

### Modified Capabilities

- `result-display`: 结果页在现有总分/熵段展示下方，新增主维度得分和五向熵维图

## Impact

- 修改 `src/data/questions.ts`：新增维度题号分组配置
- 修改 `src/utils/scoring.ts`：新增主维度和子维度计算函数
- 修改 `src/components/ResultView.tsx`：新增两个展示区块
- 新增 `src/components/PentagonChart.tsx`：SVG 五边形雷达图组件
- 无新增外部依赖
