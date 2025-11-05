# claude-ignore

一个 Claude Code PreToolUse 钩子，用于阻止 Claude 读取匹配 `.claudeignore` 文件中模式的文件，类似于 `.gitignore` 的工作方式。

## 功能特性

- **分层 .claudeignore 支持**：自动发现并应用从当前目录到根目录的所有 `.claudeignore` 文件
- 支持标准的 gitignore 风格模式
- 作为 Claude Code PreToolUse 钩子工作
- 当路径被忽略时退出代码 2，阻止 Claude 读取文件
- 过滤注释行（以 # 开头）和空行
- 灵活的项目配置，支持多层级忽略规则

## 安装

全局安装以在所有项目中使用：

```bash
npm install -g claudeignore
```

更新到最新版本：

```bash
npm update -g claudeignore
```

## 快速开始

### 方式一：自动配置（推荐）

在项目目录中运行初始化命令：

```bash
claude-ignore init
```

此命令将：

- 如果不存在 `.claudeignore` 文件则创建它
- 设置 `.claude/settings.json` 并配置必要的钩子
- 如果 `.claude/settings.json` 已存在，将显示模板配置供手动合并

### 方式二：手动配置

1. 在项目根目录创建 `.claudeignore` 文件，添加要忽略的模式：

```
.env
*.secret
```

2. 在 `.claude/settings.json` 中配置 Claude Code 使用此钩子：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "claude-ignore"
          }
        ]
      }
    ]
  }
}
```

## 命令说明

### `claude-ignore init`

在项目中初始化 claude-ignore 配置：

- 如果不存在则从模板创建 `.claudeignore` 文件
- 如果不存在则创建带有钩子配置的 `.claude/settings.json`
- 如果 `.claude/settings.json` 已存在，则显示模板配置供手动合并

### `claude-ignore`（默认）

根据 `.claudeignore` 模式检查文件是否应被忽略。这由 Claude Code 作为 PreToolUse 钩子内部使用。

## 工作原理

当 Claude 尝试读取文件时，此钩子会：

1. **发现所有 .claudeignore 文件**：从当前目录开始，向上搜索父目录以找到所有 `.claudeignore` 文件
2. **分层加载忽略模式**：合并所有发现文件中的模式，越接近根目录的文件优先处理
3. 检查文件路径是否匹配任何层级的忽略模式
4. 如果匹配，退出代码 2 以阻止读取操作
5. 如果不匹配，允许 Claude 继续读取文件

这种分层方法允许灵活的项目配置，您可以拥有：
- 项目根目录的全局忽略模式
- 子目录中的特定忽略模式
- 项目不同部分的不同忽略规则

## 开发

- 安装依赖：

```bash
npm install
```

- 构建库：

```bash
npm run build
```

- 开发监视模式：

```bash
npm run dev
```

- 类型检查：

```bash
npm run typecheck
```
