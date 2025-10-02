# Diagnostics MCP Server

> **HTTP MCP server with 5 diagnostic tools providing real-time access to ALL VS Code diagnostics (TypeScript, ESLint, Prettier, and all installed extensions)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.12-blue.svg)](https://github.com/Maaz0313-png/Diagnostics-MCP)

## 🎯 Overview

This Model Context Protocol (MCP) server provides AI agents with real-time access to all diagnostics from your VS Code workspace, including:

- ✅ **TypeScript/JavaScript** errors and warnings
- ✅ **ESLint** linting issues
- ✅ **Prettier** formatting issues
- ✅ **All Language Servers** (Python, Go, Rust, etc.)
- ✅ **All VS Code Extensions** diagnostics
- ✅ **Real-time updates** as you code

## 📋 Installation

### Step 1: Install VS Code Extension

Install from VS Code Marketplace:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Diagnostics MCP Server"
4. Click Install

**Latest Version: 1.0.12** - Complete HTTP MCP implementation with 5 diagnostic tools, enhanced error handling, and working commands

### Step 2: Extension Auto-Start

The extension automatically starts the HTTP MCP server when VS Code opens. No additional setup required!

**Server Details:**

- **Protocol**: HTTP with Server-Sent Events
- **Port**: 3846 (automatically managed)
- **Startup**: Automatic with VS Code

### Step 3: Configure MCP Client

## 🚀 Quick Start

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

Once configured, AI agents (like Claude, GitHub Copilot) can use these **5 MCP tools**:

1. **`get_all_diagnostics`** - Get complete diagnostic information from workspace
2. **`get_errors`** - Get only error-level diagnostics
3. **`get_warnings`** - Get only warning-level diagnostics
4. **`get_info`** - Get only info-level diagnostics
5. **`get_workspace_health`** - Get workspace health score (0-100)

## 🔧 How It Works

This extension uses an **HTTP MCP Server** architecture:

```
┌─────────────────────────────────────────────────────┐
│  AI Agent (Claude, GitHub Copilot)                 │
│  ↓                                                  │
│  HTTP MCP Protocol (port 3846)                     │
│  ↓                                                  │
│  VS Code Extension (HTTP MCP Server)               │
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

- **HTTP MCP Server** - Runs on port 3846 with Server-Sent Events
- **5 Diagnostic Tools** - Comprehensive workspace diagnostic access
- **3 VS Code Commands** - Start/Stop/Status server control
- **Real-time Updates** - Live diagnostic monitoring
- **Health Scoring** - Workspace quality metrics (0-100)

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

## 📖 API Reference - 5 MCP Tools

### 1. Tool: `get_all_diagnostics`

Get complete diagnostic information from workspace.

**Returns:**

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
  ],
  "status": "found",
  "timestamp": "2025-10-02T10:30:00.000Z"
}
```

### 2. Tool: `get_errors`

Get only error-level diagnostics.

**Returns:**

```json
{
  "count": 5,
  "diagnostics": [...],
  "severityLevel": "errors",
  "status": "found",
  "timestamp": "2025-10-02T10:30:00.000Z"
}
```

### 3. Tool: `get_warnings`

Get only warning-level diagnostics.

**Returns:**

```json
{
  "count": 3,
  "diagnostics": [...],
  "severityLevel": "warnings",
  "status": "found",
  "timestamp": "2025-10-02T10:30:00.000Z"
}
```

### 4. Tool: `get_info`

Get only info-level diagnostics.

**Returns:**

```json
{
  "count": 2,
  "diagnostics": [...],
  "severityLevel": "info",
  "status": "found",
  "timestamp": "2025-10-02T10:30:00.000Z"
}
```

### 5. Tool: `get_workspace_health`

Get workspace health score (0-100) based on diagnostics.

**Returns:**

```json
{
  "healthScore": 85,
  "status": "good",
  "summary": {
    "errors": 2,
    "warnings": 5,
    "infos": 3,
    "total": 10
  },
  "timestamp": "2025-10-02T10:30:00.000Z"
}
```

**Health Score Calculation:**

- Errors: -10 points each
- Warnings: -3 points each
- Info: -1 point each
- Scale: 0-100 (100 = perfect health)
- Status: excellent (90+), good (70+), fair (50+), poor (<50)

## 🎮 VS Code Commands

Three commands available in Command Palette (Ctrl+Shift+P):

1. **🚀 Diagnostics MCP: Start HTTP MCP Server (Port 3846)**

   - Manually start the MCP server
   - Use if server didn't auto-start

2. **🛑 Diagnostics MCP: Stop HTTP MCP Server**

   - Stop the running MCP server
   - Useful for troubleshooting

3. **📊 Diagnostics MCP: MCP Server Status (5 Tools + Health)**
   - View server status, current diagnostics count, and health score
   - Quick health check of your workspace

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- [GitHub Repository](https://github.com/Maaz0313-png/Diagnostics-MCP)
- [Model Context Protocol](https://modelcontextprotocol.io)

## ⚠️ Troubleshooting

### "MCP server not connecting"

1. Check server status: Visit `http://127.0.0.1:3846/health`
2. View logs: VS Code Output panel → "Diagnostics MCP Server"
3. Restart server: Use command "Diagnostics MCP: Start HTTP MCP Server"
4. Reload VS Code window: Ctrl+Shift+P → "Reload Window"

### "Port 3846 already in use"

1. Stop other applications using port 3846
2. Or change port in VS Code settings: `diagnostics-mcp.port`
3. Restart VS Code after changing port

### "No diagnostics returned"

1. Open a workspace with code files
2. Wait for language servers to initialize
3. Check VS Code's Problems tab for diagnostics

## 📝 Version History

### 1.0.12 (Current)

- ✅ Complete HTTP MCP server implementation
- ✅ 5 specialized diagnostic tools
- ✅ Enhanced error handling and connection stability
- ✅ Working VS Code commands (Start/Stop/Status)
- ✅ Comprehensive tool documentation in metadata
- ✅ Beautiful diagnostic icon
- ✅ Full workspace health scoring

### 1.0.11

- ✅ Enhanced connection stability for empty diagnostics
- ✅ HTTP transport implementation

### 1.0.10

- ✅ Added severity-specific tools (get_errors, get_warnings, get_info)

### 1.0.0 (Initial Release)

- ✅ Basic VS Code diagnostics integration
- ✅ Support for all language servers and extensions

## 💡 Use Cases

- **AI-Powered Code Review**: Let AI agents analyze all code issues
- **Automated Quality Checks**: Monitor workspace health in real-time
- **Smart Refactoring**: AI can see all diagnostics before suggesting changes
- **Learning Assistant**: Help users understand and fix code issues
- **CI/CD Integration**: Pre-commit diagnostic analysis

---

**Made with ❤️ by Maaz Tajammul**
