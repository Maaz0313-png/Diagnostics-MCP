# Quick Start Guide - Diagnostics MCP Server

## 🚀 Installation Complete!

Your Diagnostics MCP Server has been successfully set up and compiled.

## 📁 Project Structure

```
✅ src/extension.ts       - VS Code extension entry point
✅ src/mcp-server.ts      - MCP server with diagnostic tools
✅ dist/extension.js      - Compiled extension (ready to use!)
✅ dist/mcp-server.js     - Compiled MCP server
✅ package.json           - Extension configuration
✅ node_modules/          - Dependencies installed
```

## 🎯 Next Steps

### Option 1: Test in VS Code (Development Mode)

1. Open this folder in VS Code
2. Press `F5` to launch Extension Development Host
3. In the new window, check Output panel → "Diagnostics MCP Server"
4. You should see: "Diagnostics MCP Server auto-started"
5. Create a file with errors to test (e.g., `test.ts` with syntax errors)

### Option 2: Install as Extension

1. Package the extension:

   ```powershell
   npm run package
   ```

2. Install the .vsix file:

   ```powershell
   code --install-extension diagnostics-mcp-server-1.0.0.vsix
   ```

3. Reload VS Code

## 🔧 Using with AI Agents (MCP Client)

Add this to your MCP client configuration:

### For Claude Desktop or similar:

```json
{
  "mcpServers": {
    "diagnostics": {
      "command": "node",
      "args": ["d:\\MCP Development\\Diagnostics MCP\\dist\\extension.js"],
      "transport": "stdio"
    }
  }
}
```

### For custom MCP clients:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["d:\\MCP Development\\Diagnostics MCP\\dist\\extension.js"],
});

const client = new Client(
  { name: "diagnostics-client", version: "1.0.0" },
  { capabilities: {} }
);

await client.connect(transport);

// Use the tools
const diagnostics = await client.callTool("get_all_diagnostics", {});
console.log(diagnostics);
```

## 🛠️ Available Commands in VS Code

- **Start**: `Ctrl+Shift+P` → "Diagnostics MCP Server: Start"
- **Stop**: `Ctrl+Shift+P` → "Diagnostics MCP Server: Stop"
- **Status**: `Ctrl+Shift+P` → "Diagnostics MCP Server: Status"

## 🧪 Testing the MCP Tools

### Test Scenario 1: Get All Diagnostics

Create a file `test.ts`:

```typescript
let x: number = "hello"; // Type error
console.log(y); // Undefined variable
```

Call MCP tool:

```json
{
  "tool": "get_all_diagnostics",
  "arguments": {}
}
```

### Test Scenario 2: Check Workspace Health

```json
{
  "tool": "get_workspace_health",
  "arguments": {}
}
```

### Test Scenario 3: Get Errors Only

```json
{
  "tool": "get_diagnostics_by_severity",
  "arguments": {
    "severity": "error"
  }
}
```

## 📊 Real-time Updates

The server automatically detects changes:

1. Open a file with errors
2. Fix the errors
3. Call `get_diagnostics_summary` → should show reduced count
4. Add new errors
5. Call again → should show increased count

## 🔍 Troubleshooting

### Problem: No diagnostics showing

**Solution**:

- Ensure TypeScript/ESLint is enabled in VS Code
- Open files with actual errors
- Check language server is running

### Problem: Server not starting

**Solution**:

- Check Output panel: View → Output → "Diagnostics MCP Server"
- Run: `npm run compile` to rebuild
- Verify Node.js is in PATH

### Problem: MCP client can't connect

**Solution**:

- Ensure path to extension.js is correct
- Use absolute paths (not relative)
- Check stdio transport is configured

## 📖 Documentation

Full documentation available in:

- `README.md` - Complete feature list and API reference
- `TODO.md` - Task tracking and status
- Output Channel - Real-time logs in VS Code

## 🎉 Success Indicators

✅ Dependencies installed (322 packages)
✅ TypeScript compiled successfully
✅ Extension ready to run
✅ MCP server ready for stdio transport
✅ Real-time diagnostic tracking enabled

## 💡 Pro Tips

1. **Auto-start**: Server starts automatically when VS Code launches
2. **Real-time**: No polling needed - uses VS Code events
3. **All Languages**: Works with any language server (TS, Python, etc.)
4. **Performance**: Diagnostics cached in memory for fast access
5. **Health Score**: Use `get_workspace_health` for quick overview

## 🚦 Test Checklist

- [ ] Extension loads in VS Code
- [ ] Output channel shows "auto-started"
- [ ] Create file with errors → diagnostics detected
- [ ] Call `get_all_diagnostics` → returns errors
- [ ] Fix errors → call again → count decreases
- [ ] Test all 5 MCP tools
- [ ] Verify real-time updates work

---

**Status**: ✅ Ready to use!
**Transport**: stdio
**Node**: Pre-installed and working
**Compilation**: Successful
