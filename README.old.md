# Diagnostics MCP Server

A Model Context Protocol (MCP) server for real-time detection of errors, warnings, and other diagnostics from VS Code's Problems tab.

## Features

- 🔴 **Real-time Diagnostics**: Automatically detects and tracks all errors, warnings, and info messages
- 🎯 **Multiple Query Options**: Get diagnostics by file, severity, or all at once
- 📊 **Health Monitoring**: Get workspace health scores based on diagnostic severity
- ⚡ **Instant Updates**: Uses VS Code's diagnostic change events for real-time updates
- 🔌 **MCP Compatible**: Exposes diagnostics through standard MCP tools

## Available MCP Tools

### 1. `get_all_diagnostics`

Get all diagnostics from all files in the workspace.

**Returns:**

```json
{
  "total": 10,
  "diagnostics": [
    {
      "file": "/path/to/file.ts",
      "line": 15,
      "column": 10,
      "endLine": 15,
      "endColumn": 20,
      "severity": "error",
      "message": "Cannot find name 'foo'",
      "source": "typescript",
      "code": "2304"
    }
  ]
}
```

### 2. `get_file_diagnostics`

Get diagnostics for a specific file.

**Input:**

- `filePath` (string): Absolute path to the file

**Returns:**

```json
{
  "file": "/path/to/file.ts",
  "total": 3,
  "diagnostics": [...]
}
```

### 3. `get_diagnostics_by_severity`

Get diagnostics filtered by severity level.

**Input:**

- `severity` (string): One of `error`, `warning`, `information`, `hint`

**Returns:**

```json
{
  "severity": "error",
  "total": 5,
  "diagnostics": [...]
}
```

### 4. `get_diagnostics_summary`

Get a summary count of diagnostics by severity.

**Returns:**

```json
{
  "error": 5,
  "warning": 10,
  "information": 2,
  "hint": 3,
  "total": 20,
  "filesWithIssues": 8
}
```

### 5. `get_workspace_health`

Get overall workspace health score (0-100).

**Returns:**

```json
{
  "healthScore": 75,
  "status": "good",
  "breakdown": {
    "error": 2,
    "warning": 5,
    "information": 1,
    "hint": 0
  },
  "recommendation": "Good progress! Consider addressing remaining warnings"
}
```

## Installation

### Prerequisites

- Node.js (pre-installed)
- VS Code 1.85.0 or higher

### Setup Steps

1. **Install dependencies:**

   ```powershell
   npm install
   ```

2. **Compile TypeScript:**

   ```powershell
   npm run compile
   ```

3. **Package the extension (optional):**

   ```powershell
   npm run package
   ```

4. **Install in VS Code:**
   - Press `F5` to run in development mode, OR
   - Install the generated `.vsix` file using:
     ```
     code --install-extension diagnostics-mcp-server-1.0.0.vsix
     ```

## Usage

### In VS Code

The extension auto-starts when VS Code launches. You can also use these commands:

- `Diagnostics MCP Server: Start` - Start the MCP server
- `Diagnostics MCP Server: Stop` - Stop the MCP server
- `Diagnostics MCP Server: Status` - Check server status

### With MCP Clients

Connect to the server using stdio transport. Example configuration for an MCP client:

```json
{
  "mcpServers": {
    "diagnostics": {
      "command": "node",
      "args": ["/path/to/extension/dist/extension.js"],
      "transport": "stdio"
    }
  }
}
```

### Example AI Agent Usage

```typescript
// Get all errors in the workspace
const result = await mcpClient.callTool("get_diagnostics_by_severity", {
  severity: "error",
});

// Check workspace health
const health = await mcpClient.callTool("get_workspace_health", {});

// Get problems in a specific file
const fileProblems = await mcpClient.callTool("get_file_diagnostics", {
  filePath: "C:\\path\\to\\file.ts",
});
```

## Development

### Project Structure

```
diagnostics-mcp/
├── src/
│   ├── extension.ts      # VS Code extension entry point
│   └── mcp-server.ts     # MCP server implementation
├── dist/                 # Compiled JavaScript
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Build Commands

- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch mode for development
- `npm run lint` - Run ESLint
- `npm run package` - Package as .vsix

### Testing

1. Open this folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Open the Output panel and select "Diagnostics MCP Server"
4. Create a file with errors to test real-time detection

## How It Works

1. **Initialization**: Extension activates on VS Code startup
2. **Event Listening**: Subscribes to `vscode.languages.onDidChangeDiagnostics`
3. **Caching**: Maintains in-memory cache of all diagnostics
4. **Real-time Updates**: Updates cache whenever diagnostics change
5. **MCP Interface**: Exposes tools that query the current diagnostic state

## Troubleshooting

### Server not starting

- Check the Output panel (View → Output → Diagnostics MCP Server)
- Ensure Node.js is properly installed
- Verify all dependencies are installed (`npm install`)

### No diagnostics appearing

- Ensure files have actual errors/warnings
- Check that language servers are active (TypeScript, ESLint, etc.)
- Try opening/closing files to trigger diagnostic updates

### MCP client can't connect

- Verify the server is running (check Output panel)
- Ensure stdio transport is configured correctly
- Check that the path to extension.js is correct

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this in your projects!

## Author

Created for AI agents to better understand and fix code issues in real-time.
