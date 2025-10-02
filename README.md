# Diagnostics MCP Server

> **MCP server providing real-time access to ALL VS Code diagnostics (TypeScript, ESLint, Prettier, and all installed extensions)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/@diagnostics-mcp%2Fserver.svg)](https://www.npmjs.com/package/@diagnostics-mcp/server)

## 🎯 Overview

This Model Context Protocol (MCP) server provides AI agents with real-time access to all diagnostics from your VS Code workspace, including:

- ✅ **TypeScript/JavaScript** errors and warnings
- ✅ **ESLint** linting issues
- ✅ **Prettier** formatting issues
- ✅ **All Language Servers** (Python, Go, Rust, etc.)
- ✅ **All VS Code Extensions** diagnostics
- ✅ **Real-time updates** as you code

## 📋 Prerequisites

**REQUIRED:** This package requires the VS Code extension to be installed first!

### Step 1: Install VS Code Extension

Download and install the latest extension:

```powershell
# Install the latest VSIX file (enhanced stability & error handling)
code --install-extension diagnostics-mcp-server-1.0.11.vsix --force
```

Or install from VS Code Marketplace (once published):

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Diagnostics MCP Server"
4. Click Install

**Latest Version: 1.0.11** - Enhanced connection stability and error handling for empty diagnostic scenarios

### Step 2: Automatic Setup

The VS Code extension automatically starts the MCP server when VS Code opens. No additional installation required!

**Server Details:**

- **Protocol**: HTTP with Server-Sent Events
- **Port**: 3846 (automatically managed)
- **Startup**: Automatic with VS Code

## 🚀 Quick Start

### Add to MCP Client Configuration

Add this to your MCP client configuration (e.g., Claude Desktop config or VS Code MCP settings):

```json
{
  "mcpServers": {
    "diagnostics": {
      "type": "http",
      "url": "http://127.0.0.1:3846/mcp",
      "description": "VS Code diagnostics - all 5 tools (errors, warnings, info, health, all diagnostics)"
    }
  }
}
```

### Verify Connection

1. **Check server status**: Visit `http://127.0.0.1:3846/health`
2. **View logs**: VS Code Output panel → "Diagnostics MCP Server"
3. **Test connection**: Server automatically starts when VS Code opens

**Available immediately after VS Code extension installation - no additional setup required!**

### Usage

Once configured, AI agents (like GitHub Copilot) can use these MCP tools:

1. **`get_all_diagnostics`** - Get all diagnostics from the workspace
2. **`get_file_diagnostics`** - Get diagnostics for a specific file
3. **`get_diagnostics_by_severity`** - Filter by Error/Warning/Info/Hint
4. **`get_diagnostics_summary`** - Quick overview with counts
5. **`get_workspace_health`** - Health score and top problematic files

## 🔧 How It Works

This package uses a **VS Code Extension Bridge** architecture:

```
┌─────────────────────────────────────────────────────┐
│  AI Agent (GitHub Copilot)                         │
│  ↓                                                  │
│  MCP Protocol (stdio transport)                    │
│  ↓                                                  │
│  Diagnostics MCP Server (this package)             │
│  ↓                                                  │
│  VS Code Extension (provides API access)           │
│  ↓                                                  │
│  vscode.languages.getDiagnostics() API             │
│  ↓                                                  │
│  ALL Diagnostics (TS, ESLint, Prettier, etc.)     │
└─────────────────────────────────────────────────────┘
```

**Why Extension Required?**

- VS Code diagnostics are only accessible inside VS Code via the `vscode` module
- The extension provides the bridge between VS Code APIs and the MCP server
- This ensures you get **ALL** diagnostics from **ALL** sources, not just TypeScript

## 📦 What's Included

- **`index.js`** - Launcher that starts VS Code with the extension
- **`dist/`** - Compiled extension code
- **VS Code Extension** - Accesses VS Code diagnostics API
- **MCP Server** - Exposes diagnostics via MCP protocol

## 🛠️ Development

### Build from Source

```bash
git clone https://github.com/Maaz0313-png/Diagnostics-MCP.git
cd "Diagnostics MCP"
npm install
npm run compile
```

### Test Locally

```bash
# Test the launcher
node index.js --help

# Test with a workspace
node index.js
```

## 📖 API Reference

### Tool: `get_all_diagnostics`

Returns all diagnostics from the workspace.

```json
{
  "total": 42,
  "diagnostics": [
    {
      "file": "src/app.ts",
      "line": 10,
      "column": 5,
      "severity": "error",
      "message": "Type 'string' is not assignable to type 'number'",
      "source": "ts"
    }
  ]
}
```

### Tool: `get_file_diagnostics`

Get diagnostics for a specific file.

**Input:**

```json
{
  "filePath": "d:\\project\\src\\app.ts"
}
```

### Tool: `get_diagnostics_by_severity`

Filter diagnostics by severity level.

**Input:**

```json
{
  "severity": "error"
}
```

Options: `error`, `warning`, `information`, `hint`

### Tool: `get_diagnostics_summary`

Get summary with counts.

**Output:**

```json
{
  "error": 10,
  "warning": 5,
  "information": 2,
  "hint": 1,
  "total": 18,
  "filesWithIssues": 8
}
```

### Tool: `get_workspace_health`

Get workspace health score (0-100).

**Output:**

```json
{
  "healthScore": 85,
  "status": "good",
  "summary": {
    "error": 2,
    "warning": 5,
    "information": 3,
    "hint": 1
  },
  "topFiles": [
    {
      "file": "src/problematic.ts",
      "issues": 12
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- [GitHub Repository](https://github.com/Maaz0313-png/Diagnostics-MCP)
- [Model Context Protocol](https://modelcontextprotocol.io)

## ⚠️ Troubleshooting

### "VS Code extension not found"

Make sure you installed the VSIX extension first:

```bash
code --install-extension diagnostics-mcp-server-1.0.0.vsix
```

### "Failed to launch VS Code"

1. Verify VS Code is installed: `code --version`
2. Add `code` command to PATH
3. Restart your terminal

### "No diagnostics returned"

1. Open a workspace with code files
2. Wait for language servers to initialize
3. Check VS Code's Problems tab for diagnostics

## 📝 Version History

### 1.0.0 (Initial Release)

- ✅ Full VS Code diagnostics integration
- ✅ Support for all language servers
- ✅ Support for all extensions
- ✅ Real-time diagnostic updates
- ✅ 5 MCP tools for diagnostic access
- ✅ Workspace health scoring

## 💡 Use Cases

- **AI-Powered Code Review**: Let AI agents analyze all code issues
- **Automated Quality Checks**: Monitor workspace health in real-time
- **Smart Refactoring**: AI can see all diagnostics before suggesting changes
- **Learning Assistant**: Help users understand and fix code issues
- **CI/CD Integration**: Pre-commit diagnostic analysis

---

**Made with ❤️ by Maaz Tajammul**
