# Test Templates for Extension Modules

This directory contains reusable test templates for creating consistent tests across extension modules.

## Available Templates

### 1. `extension-service.spec.ts.template`

Template for testing Angular services in extension modules.

**Placeholders:**

- `{{ServiceName}}` - PascalCase service name (e.g., AssetusService)
- `{{service-name}}` - kebab-case file name (e.g., assetus-service)

**Example usage:**

```bash
node scripts/generate-extension-test.mjs service AssetusService assetus shared services
```

### 2. `extension-component.spec.ts.template`

Template for testing Angular components in extension modules.

**Placeholders:**

- `{{ComponentName}}` - PascalCase component name (e.g., AssetListComponent)
- `{{component-name}}` - kebab-case file name (e.g., asset-list)

**Example usage:**

```bash
node scripts/generate-extension-test.mjs component AssetListComponent assetus components asset-list
```

### 3. `extension-sanity.spec.ts.template`

Template for basic sanity tests to ensure test infrastructure is working.

**Placeholders:**

- `{{extension-name}}` - Extension module name (e.g., assetus)
- `{{sub-lib}}` - Sub-library name (e.g., shared, internal, core)

**Example usage:**

```bash
node scripts/generate-extension-test.mjs sanity assetus shared
```

## Usage Methods

### Method 1: Using the Helper Script (Recommended)

The `scripts/generate-extension-test.mjs` script provides the easiest way to generate tests:

```bash
# Generate a sanity test
node scripts/generate-extension-test.mjs sanity assetus shared

# Generate a service test
node scripts/generate-extension-test.mjs service AssetusService assetus shared services

# Generate a component test
node scripts/generate-extension-test.mjs component AssetListComponent assetus components asset-list
```

### Method 2: Using Nx Generator

The Nx generator is available but requires the tools package to be properly registered:

```bash
pnpm nx generate @sneat/tools:extension-test --type=sanity --extension=assetus --subLib=shared
```

### Method 3: Manual Copy and Replace

1. Copy the appropriate template file
2. Rename the file (remove `.template` extension)
3. Replace placeholders with actual values:
   - Find: `{{ServiceName}}` → Replace: `YourService`
   - Find: `{{service-name}}` → Replace: `your-service`
   - etc.

## Template Features

All templates include:

- ✅ Proper TestBed configuration
- ✅ Mock dependencies (SneatApiService, ErrorLogger)
- ✅ Basic "should create" test
- ✅ Comments with examples for additional tests
- ✅ Consistent formatting with existing tests

## Customization

After generating a test from a template:

1. **Review imports** - Add or remove imports based on actual dependencies
2. **Update providers** - Add mocks for additional services your code depends on
3. **Add test cases** - Follow the commented examples to add specific tests
4. **Test edge cases** - Consider error conditions, null values, etc.

## Best Practices

- Generate baseline tests early in development
- Use templates for consistency across the codebase
- Customize generated tests to cover actual functionality
- Run tests frequently: `pnpm nx test <project-name>`
- Maintain high coverage for critical business logic

## Documentation

For comprehensive testing guidelines, see [docs/TESTING.md](../docs/TESTING.md).

## Contributing

To improve these templates:

1. Identify common patterns in existing tests
2. Update templates to include best practices
3. Document new placeholders in this README
4. Test the templates with actual use cases
