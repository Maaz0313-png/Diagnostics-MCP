# 📦 Publishing Guide - Diagnostics MCP Server

This guide explains how to publish both the VS Code extension and the NPM package.

## 📋 What We Have

1. ✅ **VSIX File**: `diagnostics-mcp-server-1.0.0.vsix` (16.39 KB)

   - VS Code extension package
   - Ready for installation
   - Contains compiled code and sources

2. ✅ **NPM Package**: Ready to publish
   - Package name: `diagnostics-mcp-server`
   - Version: 1.0.0
   - License: MIT

## 🎯 Publishing Order

**IMPORTANT:** Publish in this order:

1. **First**: Publish VS Code Extension (VSIX)
2. **Then**: Publish NPM Package (with extension requirement documented)

## 📤 Part 1: Publishing VS Code Extension

### Option A: VS Code Marketplace (Recommended)

#### Prerequisites

1. Create a Visual Studio Marketplace account:

   - Go to https://marketplace.visualstudio.com/
   - Sign in with Microsoft/GitHub account

2. Create a Publisher:

   - Go to https://marketplace.visualstudio.com/manage
   - Create a new publisher with ID: `maaz-tajammul`
   - Fill in display name, description, etc.

3. Create a Personal Access Token (PAT):
   - Go to https://dev.azure.com/
   - User Settings → Personal Access Tokens
   - Create new token with **Marketplace (Manage)** scope
   - Copy the token (you won't see it again!)

#### Publish Extension

```powershell
# Method 1: Using vsce command
npx @vscode/vsce login maaz-tajammul
# (Enter your PAT when prompted)

npx @vscode/vsce publish

# Method 2: Upload VSIX manually
# 1. Go to https://marketplace.visualstudio.com/manage
# 2. Click "New Extension" → "Visual Studio Code"
# 3. Upload diagnostics-mcp-server-1.0.0.vsix
```

#### Verify Publication

```powershell
# Search for your extension
code --install-extension maaz-tajammul.diagnostics-mcp-server

# Or install from marketplace
# 1. Open VS Code
# 2. Extensions (Ctrl+Shift+X)
# 3. Search "Diagnostics MCP Server"
# 4. Click Install
```

### Option B: Manual VSIX Distribution

If you don't want to publish to marketplace yet:

```powershell
# Share the VSIX file directly
# Users can install with:
code --install-extension diagnostics-mcp-server-1.0.0.vsix

# Or via VS Code UI:
# 1. Extensions view
# 2. "..." menu → "Install from VSIX"
# 3. Select the .vsix file
```

## 📤 Part 2: Publishing NPM Package

### Prerequisites

1. Create NPM account:

   - Go to https://www.npmjs.com/signup
   - Or use existing account

2. Login to NPM:

```powershell
npm login
# Enter: username, password, email, OTP (if 2FA enabled)
```

### Update Package Name for NPM

Since we changed the name for VS Code, let's create a scoped package for NPM:

```powershell
# Edit package.json and change back to scoped name:
# "name": "@diagnostics-mcp/server"
# (Only for npm publish, keep extension name for vsce)
```

Or publish with current name:

```powershell
# Will publish as: diagnostics-mcp-server (no scope)
npm publish --access public
```

### Publish to NPM

```powershell
# Navigate to project
cd "d:\MCP Development\Diagnostics MCP"

# Ensure everything is compiled
npm run compile

# Test locally first
npm pack
# This creates diagnostics-mcp-server-1.0.0.tgz

# Test installation locally
npm install -g ./diagnostics-mcp-server-1.0.0.tgz

# Test it works
diagnostics-mcp --help

# If all good, publish!
npm publish --access public
```

### Verify NPM Publication

```powershell
# Check package page
# https://www.npmjs.com/package/diagnostics-mcp-server

# Install globally to test
npm install -g diagnostics-mcp-server

# Or test with npx
npx diagnostics-mcp-server --help
```

## 📝 Post-Publishing Updates

### Update README with Installation Links

Update README.md with actual marketplace links:

````markdown
## Installation

### VS Code Extension

Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=maaz-tajammul.diagnostics-mcp-server)

Or via command:
\```bash
code --install-extension maaz-tajammul.diagnostics-mcp-server
\```

### NPM Package

\```bash
npm install -g diagnostics-mcp-server
\```
````

### Update MCP Configuration Example

Update docs with actual npm package name:

```json
{
  "mcpServers": {
    "diagnostics": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "diagnostics-mcp-server"],
      "description": "VS Code diagnostics detector"
    }
  }
}
```

## 🔄 Publishing Updates

### Version Bump

```powershell
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

### Republish Extension

```powershell
# Compile
npm run compile

# Package new VSIX
npx @vscode/vsce package

# Publish to marketplace
npx @vscode/vsce publish
```

### Republish NPM

```powershell
# Compile
npm run compile

# Publish
npm publish
```

## ✅ Verification Checklist

After publishing, verify:

- [ ] VS Code Extension appears in marketplace
- [ ] Extension installs successfully: `code --install-extension maaz-tajammul.diagnostics-mcp-server`
- [ ] NPM package appears on npmjs.com
- [ ] NPM installs successfully: `npm install -g diagnostics-mcp-server`
- [ ] npx works: `npx diagnostics-mcp-server --help`
- [ ] Extension starts MCP server correctly
- [ ] MCP tools return diagnostics
- [ ] README links are correct
- [ ] GitHub repo is updated

## 🚀 Quick Publishing Commands

```powershell
# Complete publishing workflow

# 1. Ensure everything is ready
npm run compile
npm test

# 2. Create VSIX
npx @vscode/vsce package

# 3. Publish extension (if using marketplace)
npx @vscode/vsce publish

# 4. Publish to NPM
npm publish --access public

# 5. Verify
code --install-extension maaz-tajammul.diagnostics-mcp-server
npx diagnostics-mcp-server --help

# 6. Update mcp.json
# (Add configuration as shown in README)
```

## 🔗 Important Links

- **VS Code Marketplace Manager**: https://marketplace.visualstudio.com/manage
- **Azure DevOps (PAT)**: https://dev.azure.com/
- **NPM Package Manager**: https://www.npmjs.com/settings/YOUR_USERNAME/packages
- **GitHub Repo**: https://github.com/Maaz0313-png/Diagnostics-MCP
- **MCP Documentation**: https://modelcontextprotocol.io

## 💡 Tips

1. **Version Consistency**: Keep package.json version in sync for both extension and npm
2. **Test Before Publishing**: Always test locally first
3. **Changelog**: Update CHANGELOG.md with each version
4. **Git Tags**: Tag releases: `git tag v1.0.0 && git push --tags`
5. **Documentation**: Keep README updated with latest usage examples
6. **Security**: Never commit your PAT or npm tokens

## 🐛 Troubleshooting

### "Publisher not found"

- Create publisher at https://marketplace.visualstudio.com/manage
- Ensure publisher ID matches package.json

### "401 Unauthorized" (NPM)

- Run `npm login` again
- Check 2FA settings
- Verify email is confirmed

### "Package name already exists"

- Choose different name or scope
- Use `@your-username/package-name`

### VSIX too large

- Check `files` array in package.json
- Remove unnecessary files
- Use `.vscodeignore` or `files` (not both)

---

**Ready to publish? Follow the steps above and share your MCP server with the world! 🎉**
