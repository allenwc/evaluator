## Context

全新项目，无现有代码。使用 React 构建一个单页评估工具，用户依次回答 32 道题目，系统根据得分表计算总熵值并展示结果。

## Goals / Non-Goals

**Goals:**
- 使用 React 构建完整的评估量表交互流程
- 题目数据与得分表统一存放在独立的数据文件中，便于后续维护替换
- 根据用户选项计算总熵值，并分类展示熵段状态

**Non-Goals:**
- 不需要用户登录或历史记录
- 不需要后端服务或数据库
- 不需要多语言支持
- 不需要题目分组或维度分析

## Decisions

### 1. 数据文件独立存放

**决策**：题目文本和得分表放在 `src/data/questions.ts` 单一文件中，导出结构化数组。

**理由**：题目和分值是高频维护内容，独立文件避免与组件逻辑耦合，方便产品方直接修改。

**替代方案**：JSON 文件 → 不选，TypeScript 可提供类型约束，防止数据录入错误。

---

### 2. 纯前端，无后端

**决策**：所有计算在客户端完成，无需 API 请求。

**理由**：评分规则固定、数据量小，前端完全可以承载，降低部署复杂度。

---

### 3. 页面结构：两个视图

**决策**：将应用划分为两个视图状态：量表页（Questionnaire）和结果页（Result），使用 React 状态切换，不引入路由。

**理由**：流程单一（答题 → 结果），引入路由库过度设计。

---

### 4. 数据结构设计

```ts
// src/data/questions.ts
export interface Question {
  id: number;           // 题目序号 1-32
  text: string;         // 题目文本
  scores: [number, number, number, number, number]; // 对应 [完全不符, 不太符合, 一般, 比较符合, 完全符合]
}

export const questions: Question[] = [ /* 32 条题目 */ ];

export const ENTROPY_LEVELS = {
  LOW:    { min: 32,  max: 64,  label: '低熵段' },
  MEDIUM: { min: 65,  max: 127, label: '中熵段' },
  HIGH:   { min: 128, max: 160, label: '高熵段' },
};
```

---

### 5. 组件划分

```
App
├── QuestionnaireView      // 量表主视图
│   ├── QuestionItem       // 单题组件（题目文本 + 5个选项）
│   └── SubmitButton       // 提交按钮（全部作答后激活）
└── ResultView             // 结果视图（总分 + 熵段状态）
```

## Risks / Trade-offs

- **数据录入风险**：32 道题的分值需人工录入 `questions.ts`，容易出错 → 缓解：TypeScript 类型约束 `scores` 长度固定为 5 个元素，编译时即可发现格式错误
- **无持久化**：刷新页面答题结果丢失 → 在当前需求范围内可接受，如需持久化后续可加 localStorage

## Migration Plan

纯新建项目，无迁移需要。初始步骤：
1. `npx create-react-app entropy-assessment-tool --template typescript` 或使用 Vite
2. 创建 `src/data/questions.ts` 并录入题目数据
3. 按组件划分依次实现
