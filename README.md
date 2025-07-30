# claude-ignore

A Claude Code PreToolUse hook that prevents Claude from reading files that match patterns in `.claudeignore` files, similar to how `.gitignore` works.

[中文说明 / Chinese Documentation](README_CN.md)

## Features

- Reads `.claudeignore` patterns from the current working directory
- Supports standard gitignore-style patterns
- Works as a Claude Code PreToolUse hook
- Exits with code 2 when a path is ignored, preventing Claude from reading the file
- Filters out comments (lines starting with #) and empty lines

## Setup

1. Create a `.claudeignore` file in your project root with patterns to ignore:

```
node_modules/
*.log
.env
dist/
*.secret
```

2. Configure Claude Code to use this as a PreToolUse hook by adding to `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [
          {
            "type": "command",
            "command": "npx claude-ignore"
          }
        ]
      }
    ]
  }
}
```

## How it works

When Claude tries to read a file, this hook:

1. Reads `.claudeignore` patterns from the current directory
2. Checks if the file path matches any ignore patterns
3. If matched, exits with code 2 to block the read operation
4. If not matched, allows Claude to proceed with reading the file

## Development

- Install dependencies:

```bash
npm install
```

- Build the library:

```bash
npm run build
```

- Watch mode for development:

```bash
npm run dev
```

- Type checking:

```bash
npm run typecheck
```
