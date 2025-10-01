import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import * as vscode from "vscode";
import * as http from "http";

/**
 * Diagnostic information structure
 */
interface DiagnosticInfo {
  file: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  severity: string;
  message: string;
  source?: string;
  code?: string | number;
}

/**
 * MCP Server for VS Code Diagnostics
 * Provides real-time access to errors and warnings from VS Code's Problems tab
 */
export class DiagnosticsMCPServer {
  private server: Server;
  private diagnosticsCache: Map<string, vscode.Diagnostic[]> = new Map();
  private disposables: vscode.Disposable[] = [];
  private httpServer?: http.Server;

  constructor(
    private outputChannel: vscode.OutputChannel,
    private context: vscode.ExtensionContext
  ) {
    this.server = new Server(
      {
        name: "diagnostics-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupDiagnosticsListener();
    this.log("Diagnostics MCP Server initialized");
  }

  /**
   * Set up MCP tool handlers
   */
  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: "get_all_diagnostics",
          description:
            "Get all diagnostics (errors, warnings, info) from all files in the workspace",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_file_diagnostics",
          description: "Get diagnostics for a specific file path",
          inputSchema: {
            type: "object",
            properties: {
              filePath: {
                type: "string",
                description: "Absolute path to the file",
              },
            },
            required: ["filePath"],
          },
        },
        {
          name: "get_diagnostics_by_severity",
          description: "Get diagnostics filtered by severity level",
          inputSchema: {
            type: "object",
            properties: {
              severity: {
                type: "string",
                enum: ["error", "warning", "information", "hint"],
                description: "Severity level to filter by",
              },
            },
            required: ["severity"],
          },
        },
        {
          name: "get_diagnostics_summary",
          description: "Get a summary of diagnostics counts by severity",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_workspace_health",
          description:
            "Get overall workspace health score based on diagnostics",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ];
      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "get_all_diagnostics":
            return await this.getAllDiagnostics();

          case "get_file_diagnostics":
            return await this.getFileDiagnostics(args?.filePath as string);

          case "get_diagnostics_by_severity":
            return await this.getDiagnosticsBySeverity(
              args?.severity as string
            );

          case "get_diagnostics_summary":
            return await this.getDiagnosticsSummary();

          case "get_workspace_health":
            return await this.getWorkspaceHealth();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.log(`Error executing tool ${name}: ${errorMessage}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: errorMessage }, null, 2),
            },
          ],
        };
      }
    });
  }

  /**
   * Set up real-time diagnostics listener
   */
  private setupDiagnosticsListener(): void {
    // Initial load of all diagnostics
    this.refreshAllDiagnostics();

    // Listen for changes
    const disposable = vscode.languages.onDidChangeDiagnostics((e) => {
      for (const uri of e.uris) {
        const diagnostics = vscode.languages.getDiagnostics(uri);
        this.diagnosticsCache.set(uri.toString(), diagnostics);
      }
      this.log(`Diagnostics updated for ${e.uris.length} file(s)`);
    });

    this.disposables.push(disposable);
  }

  /**
   * Refresh all diagnostics from workspace
   */
  private refreshAllDiagnostics(): void {
    this.diagnosticsCache.clear();
    const allDiagnostics = vscode.languages.getDiagnostics();
    for (const [uri, diagnostics] of allDiagnostics) {
      this.diagnosticsCache.set(uri.toString(), diagnostics);
    }
    this.log(`Loaded diagnostics from ${allDiagnostics.length} file(s)`);
  }

  /**
   * Convert VS Code diagnostic to our format
   */
  private convertDiagnostic(
    uri: string,
    diagnostic: vscode.Diagnostic
  ): DiagnosticInfo {
    const severityMap = {
      [vscode.DiagnosticSeverity.Error]: "error",
      [vscode.DiagnosticSeverity.Warning]: "warning",
      [vscode.DiagnosticSeverity.Information]: "information",
      [vscode.DiagnosticSeverity.Hint]: "hint",
    };

    return {
      file: vscode.Uri.parse(uri).fsPath,
      line: diagnostic.range.start.line + 1, // Convert to 1-based
      column: diagnostic.range.start.character + 1,
      endLine: diagnostic.range.end.line + 1,
      endColumn: diagnostic.range.end.character + 1,
      severity: severityMap[diagnostic.severity],
      message: diagnostic.message,
      source: diagnostic.source,
      code: diagnostic.code ? String(diagnostic.code) : undefined,
    };
  }

  /**
   * Get all diagnostics
   */
  private async getAllDiagnostics() {
    const allDiagnostics: DiagnosticInfo[] = [];

    for (const [uri, diagnostics] of this.diagnosticsCache.entries()) {
      for (const diagnostic of diagnostics) {
        allDiagnostics.push(this.convertDiagnostic(uri, diagnostic));
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              total: allDiagnostics.length,
              diagnostics: allDiagnostics,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Get diagnostics for a specific file
   */
  private async getFileDiagnostics(filePath: string) {
    if (!filePath) {
      throw new Error("filePath is required");
    }

    const uri = vscode.Uri.file(filePath);
    const diagnostics = vscode.languages.getDiagnostics(uri);
    const converted = diagnostics.map((d) =>
      this.convertDiagnostic(uri.toString(), d)
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              file: filePath,
              total: converted.length,
              diagnostics: converted,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Get diagnostics by severity
   */
  private async getDiagnosticsBySeverity(severity: string) {
    const validSeverities = ["error", "warning", "information", "hint"];
    if (!validSeverities.includes(severity)) {
      throw new Error(
        `Invalid severity. Must be one of: ${validSeverities.join(", ")}`
      );
    }

    const filtered: DiagnosticInfo[] = [];

    for (const [uri, diagnostics] of this.diagnosticsCache.entries()) {
      for (const diagnostic of diagnostics) {
        const converted = this.convertDiagnostic(uri, diagnostic);
        if (converted.severity === severity) {
          filtered.push(converted);
        }
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              severity,
              total: filtered.length,
              diagnostics: filtered,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Get diagnostics summary
   */
  private async getDiagnosticsSummary() {
    const summary = {
      error: 0,
      warning: 0,
      information: 0,
      hint: 0,
      total: 0,
      filesWithIssues: 0,
    };

    for (const [_uri, diagnostics] of this.diagnosticsCache.entries()) {
      if (diagnostics.length > 0) {
        summary.filesWithIssues++;
      }

      for (const diagnostic of diagnostics) {
        summary.total++;
        switch (diagnostic.severity) {
          case vscode.DiagnosticSeverity.Error:
            summary.error++;
            break;
          case vscode.DiagnosticSeverity.Warning:
            summary.warning++;
            break;
          case vscode.DiagnosticSeverity.Information:
            summary.information++;
            break;
          case vscode.DiagnosticSeverity.Hint:
            summary.hint++;
            break;
        }
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(summary, null, 2),
        },
      ],
    };
  }

  /**
   * Get workspace health score
   */
  private async getWorkspaceHealth() {
    const summary = {
      error: 0,
      warning: 0,
      information: 0,
      hint: 0,
    };

    for (const [_uri, diagnostics] of this.diagnosticsCache.entries()) {
      for (const diagnostic of diagnostics) {
        switch (diagnostic.severity) {
          case vscode.DiagnosticSeverity.Error:
            summary.error++;
            break;
          case vscode.DiagnosticSeverity.Warning:
            summary.warning++;
            break;
          case vscode.DiagnosticSeverity.Information:
            summary.information++;
            break;
          case vscode.DiagnosticSeverity.Hint:
            summary.hint++;
            break;
        }
      }
    }

    // Calculate health score (0-100)
    // Errors have highest impact, warnings medium, info/hint low
    const errorPenalty = summary.error * 10;
    const warningPenalty = summary.warning * 3;
    const infoPenalty = summary.information * 1;
    const hintPenalty = summary.hint * 0.5;

    const totalPenalty =
      errorPenalty + warningPenalty + infoPenalty + hintPenalty;
    const healthScore = Math.max(0, Math.min(100, 100 - totalPenalty));

    let status: string;
    if (healthScore >= 90) {
      status = "excellent";
    } else if (healthScore >= 70) {
      status = "good";
    } else if (healthScore >= 50) {
      status = "fair";
    } else if (healthScore >= 30) {
      status = "poor";
    } else {
      status = "critical";
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              healthScore: Math.round(healthScore),
              status,
              breakdown: summary,
              recommendation:
                healthScore < 50
                  ? "Address errors and warnings to improve code quality"
                  : healthScore < 90
                  ? "Good progress! Consider addressing remaining warnings"
                  : "Excellent! Workspace is in great shape",
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Start the MCP server on HTTP
   */
  async start(port: number = 3846): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer = http.createServer(async (req, res) => {
        // Handle CORS
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.writeHead(200);
          res.end();
          return;
        }

        if (req.url === "/mcp" && req.method === "POST") {
          const transport = new SSEServerTransport("/messages", res);
          await this.server.connect(transport);
          this.log("MCP Server connected via SSE");
        } else if (req.url === "/health") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "ok", server: "diagnostics-mcp" }));
        } else {
          res.writeHead(404);
          res.end("Not Found");
        }
      });

      this.httpServer.on("error", (error) => {
        this.log(`HTTP Server error: ${error.message}`);
        reject(error);
      });

      this.httpServer.listen(port, () => {
        this.log(`MCP Server started on http://localhost:${port}/mcp`);
        resolve();
      });
    });
  }

  /**
   * Stop the MCP server
   */
  async stop(): Promise<void> {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables = [];

    if (this.httpServer) {
      await new Promise<void>((resolve) => {
        this.httpServer!.close(() => {
          this.log("HTTP Server closed");
          resolve();
        });
      });
    }

    await this.server.close();
    this.log("MCP Server stopped");
  }

  /**
   * Log message to output channel
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`[${timestamp}] ${message}`);
  }
}
