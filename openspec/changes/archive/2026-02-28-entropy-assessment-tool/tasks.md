## 1. 项目初始化

- [x] 1.1 使用 Vite + React + TypeScript 模板初始化项目（`npm create vite@latest entropy-assessment-tool -- --template react-ts`）
- [x] 1.2 清理默认模板文件（删除 `App.css` 中无关样式、清空 `App.tsx` 默认内容）
- [x] 1.3 确认项目可正常启动（`npm run dev`）

## 2. 数据文件

- [x] 2.1 创建 `src/data/questions.ts`，定义 `Question` 接口（`id`, `text`, `scores: [number, number, number, number, number]`）
- [x] 2.2 定义并导出 `ENTROPY_LEVELS` 常量（低熵 32-64 / 中熵 65-127 / 高熵 128-160）
- [x] 2.3 录入全部 32 道题目文本及各选项得分，导出 `questions` 数组

## 3. 计算逻辑

- [x] 3.1 实现 `calculateScore(answers: Record<number, number>): number` 函数，将用户所有答题得分累加
- [x] 3.2 实现 `getEntropyLevel(score: number): string` 函数，根据分值返回对应熵段标签

## 4. 组件实现

- [x] 4.1 实现 `QuestionItem` 组件：接收题目数据与当前选中值，渲染题目文本和 5 个单选选项，点击时回调更新选中状态
- [x] 4.2 实现 `QuestionnaireView` 组件：渲染全部 32 道 `QuestionItem`，管理答题状态，全部作答后激活提交按钮，点击提交触发结果计算
- [x] 4.3 实现 `ResultView` 组件：接收总分和熵段标签并展示，提供"重新评估"按钮以重置状态
- [x] 4.4 更新 `App.tsx`：管理视图切换状态（量表视图 ↔ 结果视图），在提交时执行分数计算并传递结果给 `ResultView`

## 5. 样式

- [x] 5.1 为量表页添加基础样式：题目列表布局、选项按钮高亮选中态、提交按钮禁用/激活样式
- [x] 5.2 为结果页添加基础样式：总分和熵段标签的展示排版、重新评估按钮样式

## 6. 验证

- [x] 6.1 验证 32 道题目数据完整，`scores` 数组每条均为 5 个元素
- [x] 6.2 手动测试：全部选"完全不符"时总分是否合理，全部选"完全符合"时总分是否为 160
- [x] 6.3 验证边界值：32 分显示低熵段，64 分显示低熵段，65 分显示中熵段，127 分显示中熵段，128 分显示高熵段
- [x] 6.4 验证重新评估流程：点击后返回量表页，所有题目选中状态已重置
