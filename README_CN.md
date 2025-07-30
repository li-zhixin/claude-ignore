# claude-ignore

一个 Claude Code PreToolUse 钩子，用于阻止 Claude 读取匹配 `.claudeignore` 文件中模式的文件，类似于 `.gitignore` 的工作方式。

## 功能特性

- 从当前工作目录读取 `.claudeignore` 模式
- 支持标准的 gitignore 风格模式
- 作为 Claude Code PreToolUse 钩子工作
- 当路径被忽略时退出代码 2，阻止 Claude 读取文件
- 过滤注释行（以 # 开头）和空行

## 快速开始

### 方式一：自动配置（推荐）

在项目目录中运行初始化命令：

```bash
npx claudeignore init
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
            "command": "npx claudeignore"
          }
        ]
      }
    ]
  }
}
```

## 命令说明

### `npx claudeignore init`

在项目中初始化 claude-ignore 配置：

- 如果不存在则从模板创建 `.claudeignore` 文件
- 如果不存在则创建带有钩子配置的 `.claude/settings.json`
- 如果 `.claude/settings.json` 已存在，则显示模板配置供手动合并

### `npx claudeignore`（默认）

根据 `.claudeignore` 模式检查文件是否应被忽略。这由 Claude Code 作为 PreToolUse 钩子内部使用。

## 工作原理

当 Claude 尝试读取文件时，此钩子会：

1. 从当前目录读取 `.claudeignore` 模式
2. 检查文件路径是否匹配任何忽略模式
3. 如果匹配，退出代码 2 以阻止读取操作
4. 如果不匹配，允许 Claude 继续读取文件

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
