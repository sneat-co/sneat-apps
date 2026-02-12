# Nx MCP Server Tools Reference

This document describes the MCP (Model Context Protocol) tools available from the Nx MCP server for AI agents.

## Overview

The Nx MCP server provides AI agents with deep access to the Nx workspace context, enabling better code generation, refactoring, and task execution.

## Configuration

The Nx MCP server is configured in multiple locations for different AI tools:

- **VSCode/GitHub Copilot**: `.vscode/mcp.json`
- **Claude Desktop**: `.claude/settings.local.json`
- **Gemini**: `.gemini/settings.json`
- **OpenCode**: `opencode.json`
- **Generic**: `.ai/mcp/mcp.json`

## Available MCP Tools

The Nx MCP server exposes the following tools (these are MCP API endpoints, not CLI commands):

### Core Tools

- **`nx_workspace`**: Returns a printable representation of the project graph and Nx configuration
  - Use this to understand the workspace structure
  
- **`nx_workspace_path`**: Returns the root path of the workspace
  
- **`nx_project_details`**: Returns detailed JSON configuration for a specified project
  - Parameters: project name
  - Returns the full resolved configuration including inferred targets
  
- **`nx_available_plugins`**: Lists all core and local workspace Nx plugins
  - Helps discover what plugins are available for use

### Documentation

- **`nx_docs`**: Returns relevant Nx documentation content for user queries
  - Parameters: query string
  - Use when you need to look up Nx-specific information
  - **When to use**: Advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
  - **When NOT to use**: Basic generator syntax, standard commands, things you already know

### Generators

- **`nx_generators`**: Lists available generators in the workspace
  - Shows all generators from installed plugins
  
- **`nx_generator_schema`**: Returns the schema for a specific generator
  - Parameters: generator name
  - Shows all available options, required parameters, and defaults

### Nx Cloud Tools (when enabled)

- **CI Pipeline Tools**: Tools for working with Nx Cloud CI, including pipeline details and failure debugging
- **Visualization Tools**: Task status and dependency graph visualization for IDE integrations

## Best Practices for AI Agents

1. **Use `nx_workspace` first**: When exploring a workspace, start with `nx_workspace` to understand structure
2. **Use `nx_project_details`**: To get full project configuration (don't read `project.json` directly)
3. **Use `nx_docs` wisely**: Only for complex queries, not basic syntax
4. **Check `nx_generators`**: Before scaffolding, see what generators are available
5. **Verify schemas**: Use `nx_generator_schema` to understand all available options

## Integration with Skills

The repository has several Nx-related skills that work together with the MCP server:

- **nx-workspace**: Exploration and understanding (uses MCP tools internally)
- **nx-generate**: Scaffolding with generators (uses MCP tools for discovery)
- **nx-run-tasks**: Task execution
- **nx-plugins**: Plugin discovery and management

## References

- [Nx MCP Server Documentation](https://nx.dev/docs/reference/nx-mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Nx Documentation](https://nx.dev)

## Version Requirements

- Nx >= 21.4 for `npx nx mcp` command
- For older versions: `npx nx-mcp@latest`
