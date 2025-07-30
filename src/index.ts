#!/usr/bin/env node

import ignore from "ignore";
import { existsSync, readFileSync } from "fs";
import { join, relative } from "path";

async function main() {
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

    if (ig.ignores(relativePath)) {
      console.error(`Path ${readPath} is ignored by .claudeignore`);
      process.exit(2);
    }
  }
}

main();
