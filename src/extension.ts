import * as vscode from "vscode";
import * as http from "http";

let outputChannel: vscode.OutputChannel;
let httpServer: http.Server | undefined;

/**
 * Extension activation - WITH HTTP SERVER
 */
export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Diagnostics MCP Server");
  outputChannel.appendLine("✅ EXTENSION ACTIVATED!");
  outputChannel.show();

  // Start HTTP server for MCP
  startHttpServer();

  vscode.window.showInformationMessage("✅ Diagnostics MCP - ACTIVATED!");
  console.log("✅ DIAGNOSTICS MCP: ACTIVATED");
}

/**
 * Start HTTP server for MCP protocol
 */
function startHttpServer() {
  httpServer = http.createServer((req, res) => {
    // Handle CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === "/health") {
      // Health check endpoint
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", server: "diagnostics-mcp" }));
      return;
    }

    if (req.url === "/mcp") {
      // MCP Protocol endpoint - Server-Sent Events
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      // Handle incoming MCP messages
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        if (body) {
          try {
            const message = JSON.parse(body);
            handleMCPMessage(message, res);
          } catch (error) {
            outputChannel.appendLine(`Error parsing MCP message: ${error}`);
          }
        } else {
          // Send initial connection response
          res.write(`: connected\n\n`);
        }
      });

      // Keep connection alive
      const keepAlive = setInterval(() => {
        res.write(`: keepalive\n\n`);
      }, 30000);

      req.on("close", () => {
        clearInterval(keepAlive);
        outputChannel.appendLine("MCP client disconnected");
      });

      return;
    }

    // 404 for other paths
    res.writeHead(404);
    res.end("Not Found");
  });

  httpServer.listen(3846, () => {
    outputChannel.appendLine("🚀 HTTP Server started on http://localhost:3846");
    outputChannel.appendLine("   - Health: http://localhost:3846/health");
    outputChannel.appendLine("   - MCP: http://localhost:3846/mcp");
    vscode.window.showInformationMessage(
      "🚀 Diagnostics MCP Server running on http://localhost:3846"
    );
  });

  httpServer.on("error", (error) => {
    outputChannel.appendLine(`❌ HTTP Server error: ${error.message}`);
    vscode.window.showErrorMessage(`HTTP Server error: ${error.message}`);
  });
}

/**
 * Extension deactivation
 */
export function deactivate() {
  if (httpServer) {
    httpServer.close(() => {
      outputChannel.appendLine("👋 HTTP Server stopped");
    });
  }
  console.log("👋 DIAGNOSTICS MCP: DEACTIVATED");
}

/**
 * Handle MCP protocol messages
 */
function handleMCPMessage(message: any, res: http.ServerResponse) {
  try {
    if (message.method === "initialize") {
      // Initialize request
      const response = {
        jsonrpc: "2.0",
        id: message.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "diagnostics-mcp-server",
            version: "1.0.8",
          },
        },
      };
      res.write(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
    } else if (message.method === "tools/list") {
      // List available tools
      const response = {
        jsonrpc: "2.0",
        id: message.id,
        result: {
          tools: [
            {
              name: "get_all_diagnostics",
              description: "Get all diagnostics from the workspace",
              inputSchema: {
                type: "object",
                properties: {},
              },
            },
            {
              name: "get_workspace_health",
              description: "Get workspace health score based on diagnostics",
              inputSchema: {
                type: "object",
                properties: {},
              },
            },
          ],
        },
      };
      res.write(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
    } else if (message.method === "tools/call") {
      // Handle tool calls
      const toolName = message.params?.name;
      let toolResult: any = {};

      if (toolName === "get_all_diagnostics") {
        toolResult = getAllDiagnostics();
      } else if (toolName === "get_workspace_health") {
        toolResult = getWorkspaceHealth();
      } else {
        toolResult = { error: `Unknown tool: ${toolName}` };
      }

      const response = {
        jsonrpc: "2.0",
        id: message.id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(toolResult, null, 2),
            },
          ],
        },
      };
      res.write(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
    }
  } catch (error) {
    outputChannel.appendLine(`Error handling MCP message: ${error}`);
    const errorResponse = {
      jsonrpc: "2.0",
      id: message.id || null,
      error: {
        code: -32603,
        message: "Internal error",
        data: String(error),
      },
    };
    res.write(`event: message\ndata: ${JSON.stringify(errorResponse)}\n\n`);
  }
}

/**
 * Get all diagnostics from VS Code
 */
function getAllDiagnostics() {
  const diagnostics = vscode.languages.getDiagnostics();
  let totalDiagnostics = 0;
  const diagnosticsList: any[] = [];

  for (const [uri, fileDiagnostics] of diagnostics) {
    totalDiagnostics += fileDiagnostics.length;
    for (const diagnostic of fileDiagnostics) {
      diagnosticsList.push({
        file: uri.fsPath,
        line: diagnostic.range.start.line + 1,
        column: diagnostic.range.start.character + 1,
        severity:
          diagnostic.severity === 0
            ? "error"
            : diagnostic.severity === 1
            ? "warning"
            : "info",
        message: diagnostic.message,
        source: diagnostic.source,
      });
    }
  }

  return {
    total: totalDiagnostics,
    diagnostics: diagnosticsList,
  };
}

/**
 * Get workspace health score
 */
function getWorkspaceHealth() {
  const diagnostics = vscode.languages.getDiagnostics();
  let errors = 0;
  let warnings = 0;
  let infos = 0;

  for (const [, fileDiagnostics] of diagnostics) {
    for (const diagnostic of fileDiagnostics) {
      if (diagnostic.severity === 0) errors++;
      else if (diagnostic.severity === 1) warnings++;
      else infos++;
    }
  }

  // Simple health score calculation
  const totalIssues = errors + warnings + infos;
  const errorPenalty = errors * 10;
  const warningPenalty = warnings * 3;
  const infoPenalty = infos * 1;
  const healthScore = Math.max(
    0,
    Math.min(100, 100 - (errorPenalty + warningPenalty + infoPenalty))
  );

  return {
    healthScore: Math.round(healthScore),
    status:
      healthScore >= 90
        ? "excellent"
        : healthScore >= 70
        ? "good"
        : healthScore >= 50
        ? "fair"
        : "poor",
    summary: { errors, warnings, infos, total: totalIssues },
  };
}
