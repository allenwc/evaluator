# result-display Specification

## Purpose
TBD - created by archiving change entropy-assessment-tool. Update Purpose after archive.
## Requirements
### Requirement: 展示总熵值分数
系统 SHALL 在结果页面明确显示用户的总熵值数字。

#### Scenario: 提交后跳转至结果页
- **WHEN** 用户点击提交按钮
- **THEN** 页面切换至结果视图，展示本次评估的总熵值分数

#### Scenario: 分数清晰可见
- **WHEN** 结果页面加载完成
- **THEN** 总熵值以数字形式显示，格式为"{score} 分"或等效表述

### Requirement: 展示熵段状态
系统 SHALL 在结果页面显示用户所处的熵段名称（低熵段 / 中熵段 / 高熵段）。

#### Scenario: 显示对应熵段标签
- **WHEN** 总熵值计算完成
- **THEN** 结果页显示该分数对应的熵段标签（"低熵段" / "中熵段" / "高熵段"）

### Requirement: 支持重新评估
系统 SHALL 在结果页提供返回入口，允许用户重新作答。

#### Scenario: 用户点击重新评估
- **WHEN** 用户在结果页点击"重新评估"按钮
- **THEN** 页面切换回量表视图，所有题目的选择状态重置为未作答

