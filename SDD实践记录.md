# 用 Claude Code + OpenSpec 构建多维熵值评估工具：一次 SDD 实践记录

> 本文记录了我使用 Claude Code 配合 OpenSpec（SDD 工作流）从零构建「多维熵值评估工具」的完整过程，包括两轮需求迭代。文中保留了真实的对话节奏和决策过程，供有兴趣尝试 AI 辅助软件开发的读者参考。

---

## 一、背景

*（此章节待作者补充：做这个项目的动机、熵值评估工具的理论来源、为什么选择用 Claude Code 来做等。）*

---

## 二、什么是 SDD 工作流（OpenSpec）

在正式开始之前，先简单介绍本次实践使用的工作方式。

OpenSpec 是一套「规格驱动开发」（Spec-Driven Development）的工作流，通过一系列**制品（Artifact）**来结构化地推进一个软件变更：

```
proposal（为什么做）
    ↓
design（怎么做）+ specs（做什么）
    ↓
tasks（具体任务清单）
    ↓
实现 → 验证 → 归档
```

在 Claude Code 中，通过 `/opsx:new`、`/opsx:continue`、`/opsx:verify`、`/opsx:archive` 等指令来驱动这个流程。它的核心价值在于：**在写任何一行代码之前，先把「要做什么」和「为什么这么做」明确下来**，避免 AI 直接跳入实现导致方向跑偏。

---

## 三、第一轮：核心功能构建

### 3.1 需求描述

通过 `/opsx:new` 启动变更，我用自然语言描述了需求：

> 做一个多维熵值评估工具。有一个评估量表，选项有"完全不符""不太符合""一般""比较符合""完全符合"。量表有 32 条，根据各条目不同选项的不同得分累加，得出总熵值。最终展示总熵值是多少，处于低熵段、中熵段还是高熵段。满分 160 分，32～64 为低熵，65～127 为中熵，128～160 为高熵。

在 Claude Code 追问技术栈和功能边界后，进一步确认了关键决策：

- **技术栈**：React + TypeScript + Vite
- **数据存放**：题目文本和得分表放在独立的数据文件，方便维护
- **结果页**：仅展示总分和熵段，不做复杂解读

### 3.2 制品创建过程

**Proposal**（为什么做）

Claude Code 根据我的描述起草了 `proposal.md`，明确了 4 个新 Capability：
- `assessment-scale`：量表交互
- `scoring-table`：得分数据文件
- `entropy-calculation`：计算逻辑
- `result-display`：结果展示

**Design**（怎么做）

`design.md` 记录了关键技术决策，例如：

> 数据文件独立存放：题目文本和得分表放在 `src/data/questions.ts`，TypeScript 类型约束 `scores` 长度固定为 5 个元素，编译时即可发现格式错误。
>
> 页面结构：两个视图状态（量表页 ↔ 结果页），使用 React 状态切换，不引入路由库——流程单一，引入路由过度设计。

**Specs**（做什么）

每个 Capability 对应一个 `spec.md`，用 SHALL/MUST 语言定义需求，每条需求至少包含一个可测试的 Scenario。例如：

```markdown
### Requirement: 全部作答后方可提交
系统 SHALL 仅在用户完成全部 32 道题作答后，激活提交按钮。

#### Scenario: 未全部作答时提交按钮不可用
- WHEN 用户尚有题目未作答
- THEN 提交按钮处于禁用状态，无法点击
```

**Tasks**（具体任务）

最终生成了 6 组共 18 个可执行任务，从项目初始化到验证，每条任务都是一个明确的 checkbox。

### 3.3 实现过程

进入实现阶段后，Claude Code 依次完成：

1. **项目初始化**：Vite + React + TypeScript
2. **数据文件**：`src/data/questions.ts` 定义 `Question` 接口、`ENTROPY_LEVELS` 常量，初始使用 Mock 数据占位
3. **计算逻辑**：`src/utils/scoring.ts` 实现 `calculateScore` 和 `getEntropyLevel`
4. **组件实现**：`QuestionItem` → `QuestionnaireView` → `ResultView` → `App`
5. **样式**：CSS 文件覆盖量表页和结果页的基础交互样式

### 3.4 从图片识别真实数据

Mock 数据完成后，我把题目文本和得分表以**截图形式**放在项目文件夹下，让 Claude Code 直接读取：

```
题目文本1.png / 题目文本2.png
得分表1.png  / 得分表2.png
```

Claude Code 通过图片识别，准确提取了全部 32 道题目和各选项分值，并录入 `questions.ts`。这个环节比手动录入省去了大量时间，也避免了数字转录错误。

得分表中存在两种计分方向：
- **正向题**（如「我感到每天都在朝自己的目标迈进」）：完全不符=5，完全符合=1
- **反向题**（如「我不希望那人是我」）：完全不符=1，完全符合=5

### 3.5 验证与归档

通过 `/opsx:verify` 对实现结果进行系统性检查，覆盖三个维度：

- **Completeness（完整性）**：18 个任务全部完成，9 个需求全部实现
- **Correctness（正确性）**：11 个 Scenario 均有对应实现，边界值（32/64/65/127/128 分）验证通过
- **Coherence（一致性）**：design.md 中的所有技术决策均落地，发现一处轻微偏差（`SubmitButton` 未独立拆分为子组件，直接内联在 `QuestionnaireView` 中），记录为 WARNING 但不影响功能

最终通过 `/opsx:archive` 归档，4 个 Capability 的 spec 同步写入 `openspec/specs/`，作为后续迭代的基线规格。

---

## 四、第二轮：维度分析与熵型识别

第一轮功能上线后，我提出了第二轮需求——在结果页增加更深层的分析。

### 4.1 需求来源：从文本和图片中提取

我把两份资料放在项目目录下：

**`计算方法.txt`** 描述了两套新的计算维度：

- **主维度（2个）**
  - 封闭程度（题 1-8、17-24）：<40 分为成长型思维，≥40 分为固化型思维
  - 做功阻力（题 9-16、25-32）：<40 分为增效型做功，≥40 分为内耗型做功

- **子维度（5个，各题得分之和 ÷ 题数，结果 1-5 分）**
  - 封闭性（题 1-4、17-20，÷8）
  - 平衡态（题 5-6、21-22，÷4）
  - 高线性（题 7-8、23-24，÷4）
  - 内心失序（题 9-12、25-28，÷8）
  - 能量失焦（题 13-16、29-32，÷8）

**`五向熵维图.png`** 展示了五边形雷达图的样式参考，5 个子维度分别对应五边形的 5 个顶点。

Claude Code 直接读取图片内容，理解了图表结构，不需要我用文字再描述一遍。

### 4.2 跳过完整制品流程，直接实现

第二轮我选择了更轻量的方式——只创建变更目录，并让 Claude Code 根据上下文直接实现，而非走完整的 proposal → design → specs → tasks 流程。

实现内容包括：

1. **`questions.ts`**：新增 `MAIN_DIMENSIONS` 和 `SUB_DIMENSIONS` 配置
2. **`scoring.ts`**：新增 `calculateMainDimensions` 和 `calculateSubDimensions` 函数
3. **`PentagonChart.tsx`**：纯 SVG 实现的五边形雷达图，无需引入图表库
4. **`ResultView.tsx`**：新增主维度得分区块和五向熵维图展示

### 4.3 熵型识别功能

在主维度的基础上，进一步新增了「查看我的熵型」功能：

| 熵型 | 条件 | 动物意象 |
|---|---|---|
| 🐬 海豚型 | 成长型思维 × 增效型做功 | 智慧活力，高效流动 |
| 🦥 树懒型 | 成长型思维 × 内耗型做功 | 开放从容，待提升效率 |
| 🦏 犀牛型 | 固化型思维 × 增效型做功 | 稳健有力，可拓展开放度 |
| 🪸 海鞘型 | 固化型思维 × 内耗型做功 | 觉察即是改变的起点 |

实现为一个从底部弹出的卡片（Bottom Sheet），包含分序动画：遮罩淡入 → 卡片弹出 → Emoji 缩放 → 文字内容依次淡入。

---

## 五、迭代中的问题修复

整个开发过程并非一帆风顺，记录几个典型问题：

### 问题 1：TypeScript 接口导出报错

```
Uncaught SyntaxError: The requested module '/src/data/questions.ts'
does not provide an export named 'Question'
```

**原因**：TypeScript interface 在运行时被擦除，Vite 的模块处理要求接口必须用 `import type` 导入。

**修复**：将 `QuestionItem.tsx` 中的 `import { Question }` 改为 `import type { Question }`，一行解决。

### 问题 2：五向熵维图标签被裁切

顶部「封闭性」标签不显示，左右两侧标签显示不全。

**原因**：SVG viewBox 为 `0 0 260 260`，而顶部顶点的标签 y 坐标计算为 -4，超出了 viewBox 上边界；左右顶点文字也超出左右边界。

**修复**：将画布从 260×260 扩展为 340×300，圆心从 (130, 130) 移至 (170, 155)，为四个方向的标签预留足够空间。同时根据顶点位于圆心上方还是下方，调整文字的垂直偏移方向。

### 问题 3：Vercel 部署配置错误

`vercel.json` 中的 `rootDirectory` 字段导致部署失败：

```
Invalid request: should NOT have additional property 'rootDirectory'
```

**原因**：`rootDirectory` 是 Vercel 项目级配置，只能在控制台设置，不能写在 `vercel.json` 中。

**修复**：删除该字段，将 `vercel.json` 移入 `app/` 子目录，Vercel 控制台手动指定 Root Directory 为 `app`。

---

## 六、关于 SDD 工作流的一些观察

经过这次实践，我对 SDD 工作流有几点直观感受：

**它真正有价值的地方**，是在动手写代码之前，把「为什么做」「做什么」「怎么做」分开思考。proposal → design → specs 的过程，实际上是在逼迫你（和 AI）澄清模糊的需求，减少后期返工。

**制品的颗粒度可以灵活调整**。第一轮我走了完整流程，第二轮因为需求相对清晰，就跳过了中间步骤直接实现。SDD 不是一套必须严格执行的仪式，而是一个思维框架。

**图片识别大幅降低了数据录入门槛**。量表题目和得分表直接以截图提供，Claude Code 能准确识别并结构化输出，这是我没有预料到的高效之处。

**验证环节是必要的**。`/opsx:verify` 的三个维度（完整性、正确性、一致性）帮助我发现了几处 tasks.md 中已验证但未标记完成的任务，以及一处设计文档和实现之间的微小偏差。即使是小项目，有一个结构化的验收过程也比随意浏览代码更可靠。

---

## 七、总结与展望

*（此章节待作者补充：整体体验评价、对未来 AI 辅助开发的看法、这个工具后续的计划等。）*

---

## 附：项目技术栈与文件结构

**技术栈**

- React 18 + TypeScript + Vite
- 纯 CSS（无 UI 框架）
- 纯 SVG（无图表库）
- 部署：Vercel

**核心文件结构**

```
app/src/
├── data/
│   └── questions.ts          # 32 道题目、得分表、维度配置、熵段定义
├── utils/
│   └── scoring.ts            # 总分、主维度、子维度计算函数
├── components/
│   ├── QuestionItem.tsx/css  # 单题组件
│   ├── QuestionnaireView.tsx/css  # 量表主视图
│   ├── ResultView.tsx/css    # 结果页
│   ├── PentagonChart.tsx     # 五向熵维图（SVG）
│   └── EntropyTypeCard.tsx/css    # 熵型卡片（带动画）
└── App.tsx
```

**OpenSpec 规格文件**

```
openspec/
├── specs/
│   ├── assessment-scale/spec.md
│   ├── scoring-table/spec.md
│   ├── entropy-calculation/spec.md
│   └── result-display/spec.md
└── changes/archive/
    └── 2026-02-28-entropy-assessment-tool/  # 已归档的第一轮变更
```
