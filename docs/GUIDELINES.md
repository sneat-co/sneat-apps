# Guidelines for AI Agents and Humans

> **Single Source of Truth**: This document serves as the primary reference for all development practices, coding standards, and workflows in the Sneat Apps repository. Both AI agents and human developers should follow these guidelines.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment](#development-environment)
3. [Technology Stack](#technology-stack)
4. [Nx Workspace Guidelines](#nx-workspace-guidelines)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Git Workflow](#git-workflow)
8. [Firebase Development](#firebase-development)
9. [Mobile Development](#mobile-development)
10. [Security Best Practices](#security-best-practices)
11. [Documentation Standards](#documentation-standards)
12. [AI Agent Specific Guidelines](#ai-agent-specific-guidelines)

---

## Project Overview

Sneat Apps is an Nx monorepo containing open source applications that help in work and personal life:

- **Sneat.app** - A family app for managing members, schedule, contacts, assets, budgeting, and lists
- **DataTug** - SQL & HTTP queries workbench
- **Mobile Apps** - Built with Ionic and Capacitor for iOS and Android

### Architecture

- **Frontend**: Angular 21+ with Ionic Framework 8+
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Mobile**: Capacitor 8+ for native functionality
- **Monorepo**: Nx 22+ for build orchestration
- **Package Manager**: pnpm

---

## Development Environment

### Prerequisites

1. **Node.js** - Current LTS version recommended
2. **pnpm** - Required package manager (`npm i -g pnpm`)
3. **Firebase Tools** - For running emulators (`npm i -g firebase-tools`)
4. **Java SE** - Required for Firebase emulators
5. **Go** - For backend development (if working with sneat-go-backend)

### Installation

```bash
# Clone repository
git clone https://github.com/sneat-co/sneat-apps.git
cd sneat-apps

# Install dependencies
pnpm install

# Start development server
pnpm nx serve <app-name>
```

### Running Firebase Emulators

```bash
# From project root
pnpm firebase-emulators:dev
```

See [README-DEV-SETUP.md](./README-DEV-SETUP.md) for detailed setup instructions.

---

## Technology Stack

### Core Technologies

- **Angular 21+** - Modern web framework with standalone components
- **TypeScript 5.9+** - Typed JavaScript
- **Ionic Framework 8+** - Mobile UI toolkit
- **Capacitor 8+** - Cross-platform native runtime
- **RxJS** - Reactive programming

### Build & Testing Tools

- **Nx 22+** - Extensible monorepo tools
- **Vitest** - Unit testing framework
- **@analogjs/vitest-angular** - Angular testing utilities
- **Playwright** - E2E testing
- **ESLint** - Linting
- **Prettier** - Code formatting

### Backend Services

- **Firebase Authentication** - User management
- **Firestore** - NoSQL database
- **Cloud Storage** - File storage
- **Cloud Functions** - Serverless functions (Go backend)

---

## Nx Workspace Guidelines

### Command Execution

**ALWAYS** use `pnpm nx` prefix for all Nx commands:

```bash
# ✅ Correct
pnpm nx build my-app
pnpm nx test my-lib
pnpm nx lint my-project

# ❌ Incorrect
nx build my-app        # Don't use global CLI
npm run nx build       # Use pnpm, not npm
```

### Running Tasks

```bash
# Run single task
pnpm nx <target> <project>

# Run task for multiple projects
pnpm nx run-many --target=build --all
pnpm nx run-many --target=test --projects=lib1,lib2

# Run affected tasks only
pnpm nx affected --target=build
pnpm nx affected --target=test
```

### Project Structure

```
apps/                    # Application projects
libs/                    # Shared libraries
  extensions/           # Extension modules
    {module-name}/
      {module-name}-core      # Business logic
      {module-name}-shared    # Shared components
      {module-name}-pages     # Page components
```

### Nx Skills for AI Agents

- **nx-workspace**: Use FIRST for exploring projects, targets, and dependencies
- **nx-generate**: Use for scaffolding apps, libraries, and components
- **nx-run-tasks**: Use for executing build, test, lint, and other tasks
- **nx-plugins**: Use for discovering and adding plugins

**Important**:

- Check `nx_docs` or `--help` when unfamiliar with flags
- Don't guess CLI syntax
- The `nx-generate` skill handles generator discovery internally

### Nx MCP Server

AI agents have access to the **Nx MCP (Model Context Protocol) Server**, which provides deep workspace context:

- **What it is**: A specialized server that gives AI agents structured access to Nx monorepo context
- **Available tools**: `nx_workspace`, `nx_project_details`, `nx_docs`, `nx_generators`, `nx_generator_schema`, and more
- **Configuration**: Set up in `.vscode/mcp.json`, `.claude/settings.local.json`, `.gemini/settings.json`, etc.
- **Reference**: See [NX-MCP-TOOLS.md](./NX-MCP-TOOLS.md) for complete tool documentation

**When to use MCP tools**:
- `nx_workspace` - Understand workspace structure and project graph
- `nx_project_details` - Get full resolved configuration for a project (don't read `project.json` directly)
- `nx_docs` - Look up Nx documentation for complex configurations or unfamiliar features
- `nx_generators` - Discover available generators before scaffolding
- `nx_generator_schema` - Check generator options and parameters

---

## Coding Standards

### TypeScript

#### General Rules

- **Strict mode**: Always enabled (`tsconfig.json`)
- **Naming conventions**:
  - `camelCase` - variables, functions, methods
  - `PascalCase` - classes, interfaces, types, enums
  - `UPPER_SNAKE_CASE` - constants
- **Prefer**:
  - `const` over `let`, avoid `var`
  - `async/await` over callbacks
  - Arrow functions for inline functions
  - Union types over enums (when applicable)

#### Enums vs Union Types

From [README-DEV-FAQ.md](../README-DEV-FAQ.md):

- **Enums**: More structured in TypeScript, but harder in templates
- **Union types**: Better for templates
- **Solution**: Use `EnumAsUnionOfKeys<typeof SomeEnum>` for best of both worlds

```typescript
// Good: Enum for structure
enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

// Good: Union type for flexibility
type StatusUnion = 'active' | 'inactive';

// Best: Combine both
type StatusKey = EnumAsUnionOfKeys<typeof Status>;
```

### Angular

#### Component Guidelines

- **Use standalone components** (Angular 21+)
- **Dependency injection**: Use `inject()` function
- **Signals**: Use for reactive state management where appropriate
- **Keep components focused**: Single responsibility principle

```typescript
// Good: Standalone component with inject()
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
})
export class MyComponent {
  private readonly service = inject(MyService);
}
```

#### Style

- **SCSS**: Default styling language
- **Component styles**: Co-located with components
- **Avoid inline styles**: Except for dynamic values

### Code Comments

- **Don't add unnecessary comments**: Code should be self-documenting
- **Add comments when**:
  - Complex algorithms need explanation
  - Non-obvious business logic
  - Matching existing file style
  - Explaining "why", not "what"

### Library Usage

- **Use existing libraries** whenever possible
- **Only add new dependencies** when absolutely necessary
- **Check for security vulnerabilities** before adding dependencies

---

## Testing Guidelines

### Test Framework

We use **Vitest** with **@analogjs/vitest-angular** for Angular testing.

### Test Structure

```typescript
// Service test
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MyService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [MyService, { provide: DependencyService, useValue: { method: vi.fn() } }],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(MyService)).toBeTruthy();
  });
});
```

```typescript
// Component test
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Running Tests

```bash
# Run tests for a project
pnpm nx test <project-name>

# Run affected tests
pnpm nx affected --target=test

# Run tests with coverage
pnpm nx test <project-name> --coverage

# Analyze coverage
pnpm coverage:analyze
```

### Test Best Practices

1. **Co-locate tests**: Place `.spec.ts` files next to source files
2. **Test templates**: Use templates from `templates/` directory
3. **Mock dependencies**: Use `vi.fn()` for mocking
4. **Use CUSTOM_ELEMENTS_SCHEMA**: For Ionic components in Angular tests
5. **Write meaningful tests**: Focus on behavior, not implementation
6. **Coverage**: Aim for meaningful coverage, not 100%
7. **Test critical paths**: Focus on user flows and business logic

### E2E Testing

- **Playwright** for end-to-end tests
- Configuration in `playwright.config.ts`
- Tests in `tests/` directory

---

## Git Workflow

### Commits

- **Signed commits required**
- **Conventional commit format recommended**:
  ```
  feat: add new feature
  fix: resolve bug
  docs: update documentation
  test: add tests
  refactor: code restructuring
  chore: maintenance tasks
  ```

### Git Hooks

- Pre-commit hooks configured in `.git-hooks/`
- Runs ESLint and Prettier via lint-staged
- Setup automatically on `pnpm install` via `prepare` script

### Branches

- **main**: Production-ready code
- **Feature branches**: `feature/description`
- **Bug fixes**: `fix/description`
- **Copilot branches**: `copilot/description`

### What Not to Commit

**NEVER commit**:

- `node_modules/`
- Build artifacts (`dist/`, `.angular/`, etc.)
- Coverage reports
- Secrets or credentials
- IDE-specific files (except `.vscode/` config)
- Temporary files
- Firebase emulator data (except initial seed data)

**Use `.gitignore`** to exclude these files.

---

## Firebase Development

### Emulators

**Always use Firebase emulators** for local development:

```bash
# Start emulators (from project root)
pnpm firebase-emulators:dev

# Or manually
cd ../sneat-go-backend
firebase emulators:start --only auth,firestore --config firebase/firebase.json
```

### Firebase Services Used

- **Authentication**: User login/signup
- **Firestore**: NoSQL database
- **Cloud Storage**: File uploads
- **Cloud Functions**: Backend logic (Go)

### Firestore Best Practices

1. **Use subcollections** for nested data
2. **Denormalize when necessary** for read performance
3. **Batch writes** when updating multiple documents
4. **Use transactions** for atomic operations
5. **Index appropriately** based on queries

### Configuration

- Firebase config in `sneat-go-backend` repository
- Environment variables for emulator connection
- Never commit production credentials

---

## Mobile Development

### Platform-Specific

- **iOS**: Projects in `ios/` directory
- **Android**: Projects in `android/` directory
- **Capacitor config**: `capacitor.config.ts`

### Capacitor

```bash
# Sync changes to native projects
npx cap sync

# Open in native IDE
npx cap open ios
npx cap open android

# Run on device/emulator
npx cap run ios
npx cap run android
```

### Platform-Specific Code

Use Capacitor APIs for platform detection:

```typescript
import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform(); // 'ios', 'android', 'web'
const isNative = Capacitor.isNativePlatform();
```

### Testing on Mobile

1. Test responsive design in browser first
2. Test on iOS simulator/device
3. Test on Android emulator/device
4. Test offline functionality
5. Test deep linking and push notifications

---

## Security Best Practices

### Code Security

1. **Never commit secrets**: Use environment variables
2. **Validate all inputs**: Both client and server-side
3. **Sanitize user input**: Prevent XSS attacks
4. **Use Firebase Security Rules**: Protect database access
5. **HTTPS only**: Never use HTTP in production
6. **Keep dependencies updated**: Regularly check for vulnerabilities

### Dependency Security

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

### Firebase Security Rules

- Define strict Firestore security rules
- Test rules with Firebase emulator
- Never allow open read/write access in production

### Authentication

- Use Firebase Authentication
- Implement proper session management
- Use secure tokens
- Implement rate limiting

---

## Documentation Standards

### Code Documentation

````typescript
/**
 * Brief description of what this does
 *
 * @param param1 Description of param1
 * @param param2 Description of param2
 * @returns Description of return value
 *
 * @example
 * ```typescript
 * const result = myFunction('value1', 'value2');
 * ```
 */
export function myFunction(param1: string, param2: string): string {
  // Implementation
}
````

### Project Documentation

- **README.md**: Project overview and quick start
- **docs/**: Detailed documentation
- **CONTRIBUTING.md**: Contribution guidelines (if applicable)
- **CHANGELOG.md**: Version history (if applicable)

### Keep Documentation Updated

- Update docs when changing functionality
- Document breaking changes
- Include migration guides for major changes

---

## AI Agent Specific Guidelines

### For All AI Agents

1. **Follow these guidelines strictly**: This is the single source of truth
2. **Use Nx workspace tools**: Never bypass Nx for builds/tests
3. **Make minimal changes**: Surgical, precise modifications only
4. **Test changes**: Always run affected tests
5. **Commit frequently**: Use small, focused commits
6. **Security first**: Check for vulnerabilities in dependencies

### Task Execution Patterns

#### Before Making Changes

1. **Explore the codebase**: Understand context
2. **Check existing patterns**: Follow established conventions
3. **Run existing tests**: Baseline status
4. **Plan changes**: Outline approach

#### Making Changes

1. **Use ecosystem tools**: Nx generators, Angular CLI, etc.
2. **Follow existing structure**: Match project organization
3. **Update tests**: Reflect code changes
4. **Lint and format**: Run ESLint and Prettier

#### After Making Changes

1. **Run affected tests**: Verify no regressions
2. **Run affected linters**: Ensure code quality
3. **Manual verification**: Test functionality
4. **Commit changes**: Clear, descriptive messages

### Nx Skills Usage

- **Invoke `nx-workspace` skill FIRST** when navigating/exploring
- **Invoke `nx-generate` skill** for scaffolding (don't explore first)
- **Invoke `nx-run-tasks` skill** for running tasks
- **Check `nx_docs`** when unfamiliar with commands

### Command Patterns

```bash
# ✅ Always use pnpm nx
pnpm nx <command> <project>

# ✅ Use run-many for multiple projects
pnpm nx run-many --target=build --all

# ✅ Use affected for changed code
pnpm nx affected --target=test

# ❌ Never use global nx
nx build my-app

# ❌ Never bypass nx for tasks
ng build my-app
```

### File Operations

1. **Use `view` tool**: Check existing files before editing
2. **Use `edit` tool**: Make precise changes
3. **Use `create` tool**: Only for new files
4. **Never recreate existing files**: Risk of data loss
5. **Batch edits**: Multiple edits to same file in one response

### Testing

1. **Run tests after changes**: `pnpm nx test <project>`
2. **Check affected only**: `pnpm nx affected --target=test`
3. **Fix test failures**: Related to your changes only
4. **Don't remove tests**: Unless absolutely necessary
5. **Add tests for new code**: Follow existing patterns

### Error Handling

1. **Read error messages carefully**: Often self-explanatory
2. **Check documentation**: Use `nx_docs` when stuck
3. **Try `--help` flag**: For command syntax
4. **Ask for clarification**: When truly stuck
5. **Don't guess**: Validate assumptions

### What NOT to Do

- [src_old](../src_old) is a folder for deprecated code – do not investigate it unless explicitly asked to do so.

**NEVER**:

- Modify `.github/agents/` directory (agent-specific instructions)
- Delete working code unless necessary
- Fix unrelated bugs (out of scope)
- Add dependencies without checking security
- Commit secrets or credentials
- Disable linting rules without reason
- Make assumptions about requirements
- Use global `nx` command
- Bypass Nx for tasks
- Remove or modify tests unrelated to your changes

### Exceptions for Custom Agents

**When a custom agent completes work**:

- DO NOT run linters, builds, or tests on their changes
- Accept their work as final
- Trust the custom agent's expertise

### Communication

- **Report progress regularly**: Use `report_progress` tool
- **Create clear commit messages**: Descriptive and concise
- **Ask questions**: When requirements are unclear
- **Provide context**: In reports and summaries
- **Be transparent**: About limitations or uncertainties

---

## Quick Reference

### Common Commands

```bash
# Development
pnpm nx serve <app>
pnpm nx build <app>
pnpm nx test <project>
pnpm nx lint <project>

# Nx workspace
pnpm nx graph                    # View dependency graph
pnpm nx list                     # List installed plugins
pnpm nx show project <name>      # Show project details

# Testing
pnpm nx affected --target=test   # Test affected projects
pnpm coverage:analyze            # Analyze test coverage

# Code quality
pnpm oxlint                      # Fast linting
pnpm oxlint:fix                  # Auto-fix linting issues

# Firebase
pnpm firebase-emulators:dev      # Start emulators
```

### Useful Resources

- [README.md](../README.md) - Project overview
- [README-DEV-FAQ.md](../README-DEV-FAQ.md) - Developer FAQ
- [README-DEV-SETUP.md](./README-DEV-SETUP.md) - Setup guide
- [TESTING.md](./TESTING.md) - Testing guide
- [AGENTS.md](../AGENTS.md) - AI agent instructions
- [Nx Documentation](https://nx.dev) - Nx official docs
- [Angular Documentation](https://angular.dev) - Angular official docs
- [Ionic Documentation](https://ionicframework.com/docs) - Ionic official docs

---

## Contributing

When contributing to this repository:

1. Read and follow these guidelines
2. Check existing issues and PRs
3. Write clear, descriptive commit messages
4. Ensure all tests pass
5. Update documentation as needed
6. Follow the established code style
7. Make small, focused changes
8. Test your changes thoroughly

---

**Last Updated**: 2026-02-11

**Maintained by**: Sneat Co Team
