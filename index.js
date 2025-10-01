#!/usr/bin/env node

/**
 * Diagnostics MCP Server Launcher
 * Launches VS Code extension to access ALL diagnostics
 * (TypeScript, ESLint, Prettier, and all installed extensions)
 *
 * Run with: npx @diagnostics-mcp/server
 *           or: node index.js
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.error("╔═══════════════════════════════════════════════════════╗");
console.error("║   DIAGNOSTICS MCP SERVER - FULL VS CODE INTEGRATION   ║");
console.error("╚═══════════════════════════════════════════════════════╝\n");

console.error("📍 Workspace:", process.cwd());
console.error("📦 Extension:", __dirname);
console.error("");

// Find VS Code executable
function findVSCode() {
  const platform = process.platform;

  if (platform === "win32") {
    return "code.cmd";
  } else if (platform === "darwin") {
    return "code";
  } else {
    return "code";
  }
}

// Check if extension is compiled
function checkCompiled() {
  const extensionJS = resolve(__dirname, "dist", "extension.js");
  return existsSync(extensionJS);
}

// Compile extension
async function compileExtension() {
  console.error("🔨 Compiling TypeScript extension...");

  return new Promise((resolve, reject) => {
    const tsc = spawn("npm", ["run", "compile"], {
      cwd: __dirname,
      stdio: ["inherit", "inherit", "inherit"],
      shell: true,
    });

    tsc.on("close", (code) => {
      if (code === 0) {
        console.error("✅ Extension compiled successfully\n");
        resolve();
      } else {
        reject(new Error("Compilation failed"));
      }
    });

    tsc.on("error", (err) => {
      reject(err);
    });
  });
}

// Launch VS Code with extension
async function launchMCPServer() {
  try {
    // Check if compiled, if not compile
    if (!checkCompiled()) {
      console.error("⚠️  Extension not compiled yet\n");
      await compileExtension();
    }

    const vscode = findVSCode();
    const extensionPath = __dirname;
    const workspace = process.cwd();

    console.error("🎯 Features:");
    console.error("   ✓ TypeScript errors");
    console.error("   ✓ ESLint warnings");
    console.error("   ✓ Prettier issues");
    console.error("   ✓ ALL extension diagnostics");
    console.error("   ✓ Real-time updates");
    console.error("");
    console.error("🚀 Launching VS Code with MCP Server...\n");

    // Launch VS Code extension
    const vscodeProcess = spawn(
      vscode,
      [workspace, `--extensionDevelopmentPath=${extensionPath}`],
      {
        stdio: "inherit",
        shell: true,
      }
    );

    vscodeProcess.on("error", (error) => {
      console.error("\n❌ Failed to launch VS Code:", error.message);
      console.error("");
      console.error("💡 Solutions:");
      console.error("   1. Install VS Code: https://code.visualstudio.com/");
      console.error("   2. Add 'code' command to PATH");
      console.error("   3. Test with: code --version");
      console.error("");
      process.exit(1);
    });

    vscodeProcess.on("close", (code) => {
      console.error("\n👋 MCP Server stopped");
      process.exit(code || 0);
    });
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("");
    console.error("💡 Try:");
    console.error("   npm install");
    console.error("   npm run compile");
    console.error("");
    process.exit(1);
  }
}

// Handle signals
process.on("SIGINT", () => {
  console.error("\n\n⏹️  Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("\n\n⏹️  Shutting down gracefully...");
  process.exit(0);
});

// Show usage if --help
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.error("Usage: npx @diagnostics-mcp/server [options]");
  console.error("");
  console.error("Options:");
  console.error("  --help, -h     Show this help message");
  console.error("");
  console.error("Description:");
  console.error("  Launches VS Code extension that runs an MCP server");
  console.error("  with access to ALL diagnostics from VS Code:");
  console.error("  - TypeScript/JavaScript errors");
  console.error("  - ESLint warnings");
  console.error("  - Prettier issues");
  console.error("  - All language server diagnostics");
  console.error("  - All extension-provided diagnostics");
  console.error("");
  console.error("MCP Tools Available:");
  console.error("  - get_all_diagnostics");
  console.error("  - get_file_diagnostics");
  console.error("  - get_diagnostics_by_severity");
  console.error("  - get_diagnostics_summary");
  console.error("  - get_workspace_health");
  console.error("");
  process.exit(0);
}

// Start
console.error("⏳ Starting...\n");
launchMCPServer().catch((error) => {
  console.error("❌ Fatal error:", error.message);
  process.exit(1);
});
