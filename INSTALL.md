# 🚀 Quick Installation Guide

## For You (Developer)

### Step 1: Install the Extension Locally

```powershell
# Install the VSIX you just created
code --install-extension "d:\MCP Development\Diagnostics MCP\diagnostics-mcp-server-1.0.0.vsix"
```

### Step 2: Test the Extension

1. Open VS Code
2. Open a workspace with TypeScript files
3. Check if extension is active:
   - Press `Ctrl+Shift+P`
   - Search for "Diagnostics MCP"
   - You should see: Start/Stop/Status commands

### Step 3: Update Your MCP Configuration

Your current `mcp.json` already has it configured!

Location: `C:\Users\Maaz\AppData\Roaming\Code\User\mcp.json`

Current config:

```json
"diagnostics": {
  "type": "stdio",
  "command": "node",
  "args": ["d:\\MCP Development\\Diagnostics MCP\\index.js"],
  "description": "VS Code diagnostics detector (TypeScript, ESLint, Prettier, all extensions)"
}
```

### Step 4: Test the MCP Server

```powershell
# Test the launcher
cd "d:\MCP Development\Diagnostics MCP"
node index.js --help
```

This should show:

- Usage information
- 5 MCP tools available
- Features list

### Step 5: Test with AI Agent

1. Restart VS Code (reload window)
2. Open a workspace with some errors/warnings
3. Use GitHub Copilot and ask:
   - "What diagnostics do we have?"
   - "Show me all errors in the workspace"
   - "What's the workspace health?"

The AI should be able to use the MCP tools to access diagnostics!

## For Others (After Publishing)

### Method 1: Install Extension from VSIX

```powershell
# Download the VSIX file
# Then install:
code --install-extension diagnostics-mcp-server-1.0.0.vsix
```

### Method 2: Install from Marketplace (After Publishing)

```powershell
code --install-extension maaz-tajammul.diagnostics-mcp-server
```

Or in VS Code:

1. Extensions (Ctrl+Shift+X)
2. Search "Diagnostics MCP Server"
3. Click Install

### Method 3: Global NPM Install (After Publishing)

```powershell
npm install -g diagnostics-mcp-server
```

Then in `mcp.json`:

```json
"diagnostics": {
  "type": "stdio",
  "command": "diagnostics-mcp",
  "description": "VS Code diagnostics detector"
}
```

### Method 4: npx (No Installation - After Publishing)

In `mcp.json`:

```json
"diagnostics": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "diagnostics-mcp-server"],
  "description": "VS Code diagnostics detector"
}
```

## 🧪 Testing Checklist

- [ ] Extension installs without errors
- [ ] Extension shows in Extensions list
- [ ] Commands appear in Command Palette
- [ ] `node index.js --help` shows usage
- [ ] MCP server starts when workspace opens
- [ ] AI can access diagnostic tools
- [ ] Tools return real diagnostics from workspace
- [ ] All diagnostic sources work (TS, ESLint, etc.)

## 🐛 Quick Troubleshooting

### Extension not found

```powershell
# Check if installed
code --list-extensions | Select-String "diagnostics"

# Reinstall
code --uninstall-extension diagnostics-mcp-server
code --install-extension "d:\MCP Development\Diagnostics MCP\diagnostics-mcp-server-1.0.0.vsix"
```

### MCP server not starting

```powershell
# Check compilation
cd "d:\MCP Development\Diagnostics MCP"
npm run compile

# Check dist folder exists
Test-Path ".\dist\extension.js"
Test-Path ".\dist\mcp-server.js"
```

### No diagnostics returned

1. Ensure workspace has TypeScript/JavaScript files
2. Wait for language server to initialize (5-10 seconds)
3. Check VS Code Problems tab has diagnostics
4. Check extension output: View → Output → "Diagnostics MCP Server"

## 📝 Next Steps

1. ✅ Test locally (you're here!)
2. 📤 Publish to VS Code Marketplace (see PUBLISHING.md)
3. 📦 Publish to NPM (see PUBLISHING.md)
4. 🌍 Share with community
5. 🎉 Add to your MCP configuration

---

**You're all set! The VSIX is ready to install and test. 🎯**
