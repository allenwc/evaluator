## ADDED Requirements

### Requirement: 计算总熵值
系统 SHALL 将用户 32 道题所选选项的得分全部累加，得出总熵值。

#### Scenario: 正常计算总分
- **WHEN** 用户提交全部 32 道题的作答
- **THEN** 系统读取每题用户所选选项在 `questions.ts` 中对应的分值，将 32 个分值相加得出总熵值

#### Scenario: 总分在合法范围内
- **WHEN** 用户完成作答且每题均有有效选项
- **THEN** 计算结果 SHALL 在 32 ～ 160 之间（含边界值）

### Requirement: 判断熵段
系统 SHALL 根据总熵值与 `ENTROPY_LEVELS` 定义的区间进行比对，确定用户所处熵段。

#### Scenario: 总分落入低熵段
- **WHEN** 总熵值在 32 ～ 64 之间
- **THEN** 系统判定熵段为"低熵段"

#### Scenario: 总分落入中熵段
- **WHEN** 总熵值在 65 ～ 127 之间
- **THEN** 系统判定熵段为"中熵段"

#### Scenario: 总分落入高熵段
- **WHEN** 总熵值在 128 ～ 160 之间
- **THEN** 系统判定熵段为"高熵段"
