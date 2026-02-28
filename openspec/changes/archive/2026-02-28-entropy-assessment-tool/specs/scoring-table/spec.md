## ADDED Requirements

### Requirement: 题目与得分数据存放于独立文件
系统 SHALL 将 32 道题目的文本和各选项对应得分统一定义在 `src/data/questions.ts` 中，不得硬编码于组件内。

#### Scenario: 数据文件结构合法
- **WHEN** 开发者查看 `src/data/questions.ts`
- **THEN** 文件导出 `questions` 数组，每个元素包含 `id`（1-32）、`text`（题目文本）、`scores`（长度为 5 的数字元组，依次对应"完全不符 / 不太符合 / 一般 / 比较符合 / 完全符合"的得分）

### Requirement: 每题各选项得分可独立配置
系统 SHALL 支持 32 道题中每道题的 5 个选项分别配置不同分值，不要求各题分值规律一致。

#### Scenario: 不同题目不同选项得分不同
- **WHEN** 计算引擎读取某题用户所选选项
- **THEN** 按该题在数据文件中对应选项的分值计分，而非使用统一的固定分值

### Requirement: 熵段区间定义存放于数据文件
系统 SHALL 在数据文件中定义低熵/中熵/高熵的分值区间，不得在组件中硬编码判断逻辑。

#### Scenario: 熵段区间可查
- **WHEN** 开发者查看 `src/data/questions.ts`
- **THEN** 文件导出 `ENTROPY_LEVELS` 常量，包含低熵（32-64）、中熵（65-127）、高熵（128-160）的 min/max/label 定义
