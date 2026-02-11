# Extension Test Generator

This generator helps you quickly create test files for extension modules using standardized templates.

## Usage

### Generate a Sanity Test

```bash
pnpm nx generate @sneat/tools:extension-test --type=sanity --extension=assetus --subLib=shared
```

### Generate a Service Test

```bash
pnpm nx generate @sneat/tools:extension-test \
  --type=service \
  --name=AssetusService \
  --extension=assetus \
  --subLib=shared \
  --path=services
```

### Generate a Component Test

```bash
pnpm nx generate @sneat/tools:extension-test \
  --type=component \
  --name=AssetListComponent \
  --extension=assetus \
  --subLib=components \
  --path=asset-list
```

## Options

| Option      | Type                                                        | Required | Description                                         |
| ----------- | ----------------------------------------------------------- | -------- | --------------------------------------------------- |
| `type`      | `service` \| `component` \| `sanity`                        | Yes      | Type of test to generate                            |
| `extension` | string                                                      | Yes      | Extension module name (e.g., assetus, budgetus)     |
| `subLib`    | `shared` \| `internal` \| `core` \| `components` \| `pages` | Yes      | Sub-library name                                    |
| `name`      | string                                                      | No\*     | Name in PascalCase (required for service/component) |
| `path`      | string                                                      | No       | Relative path within the sub-library                |

\*Required for `service` and `component` types

## Examples

### Create baseline tests for budgetus extension

```bash
# Sanity test for shared lib
pnpm nx generate @sneat/tools:extension-test --type=sanity --extension=budgetus --subLib=shared

# Sanity test for internal lib
pnpm nx generate @sneat/tools:extension-test --type=sanity --extension=budgetus --subLib=internal

# Service test
pnpm nx generate @sneat/tools:extension-test \
  --type=service \
  --name=BudgetusService \
  --extension=budgetus \
  --subLib=shared \
  --path=services
```

## Templates

The generator uses templates from the `/templates` directory:

- `extension-service.spec.ts.template` - Service test template
- `extension-component.spec.ts.template` - Component test template
- `extension-sanity.spec.ts.template` - Sanity test template

## Template Variables

The generator replaces the following placeholders in templates:

| Placeholder          | Description               | Example            |
| -------------------- | ------------------------- | ------------------ |
| `{{ServiceName}}`    | PascalCase service name   | AssetusService     |
| `{{service-name}}`   | kebab-case file name      | assetus-service    |
| `{{ComponentName}}`  | PascalCase component name | AssetListComponent |
| `{{component-name}}` | kebab-case file name      | asset-list         |
| `{{extension-name}}` | Extension module name     | assetus            |
| `{{sub-lib}}`        | Sub-library name          | shared             |

## Interactive Mode

Run the generator without options to use interactive prompts:

```bash
pnpm nx generate @sneat/tools:extension-test
```

You'll be prompted for:

1. Test type (service, component, or sanity)
2. Extension module name
3. Sub-library name
4. Name (if applicable)
5. Path (if applicable)

## Tips

- Use PascalCase for service and component names (e.g., `AssetusService`, `AssetListComponent`)
- The generator automatically converts names to kebab-case for file names
- Sanity tests are useful for ensuring the test infrastructure is working
- Review and customize the generated tests with specific test cases
- Run tests after generation: `pnpm nx test <extension>-<subLib>`
