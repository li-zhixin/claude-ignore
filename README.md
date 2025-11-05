# claude-ignore

A Claude Code PreToolUse hook that prevents Claude from reading files that match patterns in `.claudeignore` files, similar to how `.gitignore` works.

[中文说明 / Chinese Documentation](README_CN.md)

## Features

- **Hierarchical .claudeignore support**: Automatically discovers and applies `.claudeignore` files from the current directory up to the root
- Supports standard gitignore-style patterns
- Works as a Claude Code PreToolUse hook
- Exits with code 2 when a path is ignored, preventing Claude from reading the file
- Filters out comments (lines starting with #) and empty lines
- Flexible project configuration with multiple ignore levels

## Installation

Install globally to use across all projects:

```bash
npm install -g claudeignore
```

To update to the latest version:

```bash
npm update -g claudeignore
```

## Quick Start

### Option 1: Auto Setup (Recommended)

Run the init command in your project directory:

```bash
claude-ignore init
```

This will:

- Create a `.claudeignore` file if it doesn't exist
- Set up `.claude/settings.json` with the necessary hook configuration
- If `.claude/settings.json` already exists, it will show you the template configuration for manual merging

### Option 2: Manual Setup

1. Create a `.claudeignore` file in your project root with patterns to ignore:

```
.env
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
            "command": "claude-ignore"
          }
        ]
      }
    ]
  }
}
```

## Commands

### `claude-ignore init`

Initializes claude-ignore configuration in your project:

- Creates `.claudeignore` file from template if it doesn't exist
- Creates `.claude/settings.json` with hook configuration if it doesn't exist
- Shows template configuration for manual merging if `.claude/settings.json` already exists

### `claude-ignore` (default)

Checks if a file should be ignored based on `.claudeignore` patterns. This is used internally by Claude Code as a PreToolUse hook.

## How it works

When Claude tries to read a file, this hook:

1. **Discovers all `.claudeignore` files**: Starting from the current directory, it searches upward through parent directories to find all `.claudeignore` files
2. **Loads ignore patterns hierarchically**: Patterns from all discovered files are combined, with files closer to the root being processed first
3. Checks if the file path matches any ignore patterns from any level
4. If matched, exits with code 2 to block the read operation
5. If not matched, allows Claude to proceed with reading the file

This hierarchical approach allows for flexible project configuration where you can have:
- Global ignore patterns at the project root
- Specific ignore patterns in subdirectories
- Different ignore rules for different parts of your project

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
