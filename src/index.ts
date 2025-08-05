#!/usr/bin/env node

import ignore from "ignore";
import { existsSync, readFileSync, mkdirSync, copyFileSync } from "fs";
import { join, relative, dirname, isAbsolute } from "path";
import { fileURLToPath } from "url";

async function runInit() {
  console.log("Initializing Claude ignore configuration...");

  const cwd = process.cwd();
  const claudeignorePath = join(cwd, ".claudeignore");
  const claudeDir = join(cwd, ".claude");
  const settingsPath = join(claudeDir, "settings.json");

  // Find the package directory (where this script is installed)
  const __filename = fileURLToPath(import.meta.url);
  const packageDir = dirname(dirname(__filename));
  const templateClaudeignore = join(packageDir, "dist", ".claudeignore");
  let templateSettings = join(packageDir, "dist", "settings.json");

  // Copy .claudeignore if it doesn't exist
  if (!existsSync(claudeignorePath)) {
    if (existsSync(templateClaudeignore)) {
      copyFileSync(templateClaudeignore, claudeignorePath);
      console.log("Created .claudeignore file");
    } else {
      console.log("Template .claudeignore not found, skipping");
    }
  } else {
    console.log(".claudeignore already exists, skipping");
  }

  // Handle .claude/settings.json
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
  }

  if (!existsSync(settingsPath)) {
    // Create new settings.json
    if (existsSync(templateSettings)) {
      copyFileSync(templateSettings, settingsPath);
      console.log("Created .claude/settings.json file");
    } else {
      console.log("Template settings.json not found, skipping");
    }
  } else {
    // Settings.json already exists, show template for reference
    if (existsSync(templateSettings)) {
      console.log(".claude/settings.json already exists");
      console.log("Here's the template content for your reference:");
      console.log("=====================================");
      console.log(readFileSync(templateSettings, "utf8"));
      console.log("=====================================");
      console.log("You can manually merge the above configuration if needed.");
    } else {
      console.log("Template settings.json not found, skipping");
    }
  }

  console.log("Initialization complete");
}

async function main() {
  // Check if init command is requested
  if (process.argv[2] === "init") {
    await runInit();
    return;
  }
  console.log(`Current file directory: ${process.cwd()}`);

  const claudeignoreFile = join(process.cwd(), ".claudeignore");
  let ig = ignore();

  try {
    if (existsSync(claudeignoreFile)) {
      const content = readFileSync(claudeignoreFile, "utf8");
      const lines = content.split(/\r?\n|\r/);
      const patterns = lines
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"));

      if (patterns.length > 0) {
        ig = ig.add(patterns);
        console.log(
          `Loaded ${patterns.length} ignore patterns from .claudeignore`
        );
      }
    } else {
      console.log(".claudeignore file not found, using empty ignore patterns");
    }
  } catch (error) {
    console.error("Error reading .claudeignore file:", error);
  }

  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());
  const readPath =
    toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || "";
  console.log(`Read path: ${readPath}`);

  if (readPath) {
    const relativePath = relative(process.cwd(), readPath);
    console.log(`Checking relative path: ${relativePath}`);

    // Skip ignore check if path is outside current directory or on different drive
    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      console.log(
        `Skipping ignore check for path outside working directory: ${relativePath}`
      );
    } else if (ig.ignores(relativePath)) {
      console.error(`Path ${readPath} is ignored by .claudeignore`);
      process.exit(2);
    }
  }
}

main();
