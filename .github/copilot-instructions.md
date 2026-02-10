# Copilot Instructions for Sneat Apps

## Project Overview

This is an Nx monorepo containing open source apps that help in work & personal life, including:
- **Sneat.app** - A family app for members, schedule, contacts, assets, budgeting, and lists
- **DataTug** - SQL & HTTP queries workbench
- Mobile apps built with Ionic and Capacitor for iOS and Android

## Tech Stack

- **Angular 21+** - Modern web framework
- **Ionic Framework 8+** - Mobile UI toolkit
- **Capacitor 8+** - Cross-platform native runtime
- **TypeScript 5.9+** - Typed JavaScript
- **Nx 22+** - Extensible monorepo tools
- **Firebase** - Backend (Authentication, Firestore)
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **pnpm** - Package manager

## Setup Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm nx serve <app-name>

# Build application
pnpm nx build <app-name>

# Run tests
pnpm nx test <app-name>

# Run linting
pnpm nx lint <app-name>

# Run E2E tests
pnpm nx e2e <app-name>
```

## Nx Workspace Guidelines

### Running Tasks
- **ALWAYS** use `pnpm nx` prefix for Nx commands (e.g., `pnpm nx build`, `pnpm nx test`)
- Use `nx run-many` or `nx affected` to run tasks across multiple projects
- Prefer running tasks through Nx instead of using underlying tools directly
- Check `nx.json` for target defaults and cache configuration

### Project Structure
- Apps are in `apps/` directory
- Shared libraries are in `libs/` directory
- Follow the naming convention for Angular modules:
  - `{module-name}-core` - Core business logic
  - `{module-name}-shared` - Shared components and utilities
  - `{module-name}-pages` - Page components

### Generators
- Use Nx generators to scaffold new apps and libraries
- Generators are configured in `nx.json` with defaults:
  - Angular applications use SCSS, ESLint, Vitest, and Playwright
  - Libraries are buildable by default

## Coding Standards

### TypeScript
- Use TypeScript strict mode
- Prefer `async/await` over callbacks
- Use `camelCase` for variables and functions
- Use `UPPER_SNAKE_CASE` for constants
- Use union types or enums appropriately (see `README-DEV-FAQ.md` for enum guidance)

### Angular
- Follow Angular style guide
- Use standalone components when possible (Angular 21+)
- Inject dependencies using the `inject()` function in modern Angular
- Use signals for reactive state management where appropriate
- Keep components focused and single-purpose

### Testing
- Write unit tests for all new code using Vitest
- Test files should be co-located with source files (`.spec.ts`)
- Use E2E tests for critical user flows with Playwright
- Aim for meaningful test coverage (see `scripts/list-uncovered-lines.mjs`)

### Linting and Formatting
- Run `pnpm nx lint` before committing
- Use Prettier for code formatting (configured in `.prettierrc`)
- ESLint is configured for TypeScript and Angular
- Oxlint is also available for faster linting (`pnpm oxlint`)

## Git and Commits

- Use signed commits
- Git hooks are configured in `.git-hooks/`
- Lint-staged runs ESLint and Prettier on pre-commit
- Follow conventional commit messages

## Firebase

- Firebase emulators are available for local development:
  ```bash
  pnpm firebase-emulators:dev
  ```
- Authentication and Firestore are the primary Firebase services used
- Firebase configuration is in the `sneat-go-backend` repository

## Mobile Development

- iOS and Android projects are in `ios/` and `android/` directories
- Use Capacitor for native functionality
- Configuration is in `capacitor.config.ts`

## Restrictions and Best Practices

- **DO NOT** modify files in `.github/agents/` directory unless specifically asked
- **DO NOT** commit `node_modules`, build artifacts (`dist/`), or coverage reports
- **DO NOT** add new dependencies without discussing with the team
- **DO NOT** disable ESLint rules without good reason
- **DO NOT** commit secrets or sensitive data
- **ALWAYS** check existing patterns and conventions before adding new code
- **ALWAYS** run tests after making changes
- **ALWAYS** use the Nx workspace tools and commands
- **PREFER** using existing libraries over adding new dependencies
- **PREFER** small, focused commits over large changes

## Documentation

- Main README: `README.md`
- Developer FAQ: `README-DEV-FAQ.md`
- Setup guide: `docs/README-DEV-SETUP.md`
- Agent guidelines: `AGENTS.md`

## Additional Resources

- Nx workspace is configured with custom skills in `.github/skills/`
- Custom agents are in `.github/agents/`
- Project-specific documentation may exist in individual app/lib directories
