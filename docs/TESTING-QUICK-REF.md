# Test Template Quick Reference

## Generate Tests

```bash
# Service test
node scripts/generate-extension-test.mjs service ServiceName extension subLib path

# Component test
node scripts/generate-extension-test.mjs component ComponentName extension subLib path

# Sanity test
node scripts/generate-extension-test.mjs sanity extension subLib
```

## Examples

```bash
# Assetus extension
node scripts/generate-extension-test.mjs service AssetService assetus components services
node scripts/generate-extension-test.mjs component AssetFormComponent assetus components asset-form
node scripts/generate-extension-test.mjs sanity assetus shared

# Budgetus extension
node scripts/generate-extension-test.mjs service BudgetService budgetus shared services
node scripts/generate-extension-test.mjs sanity budgetus internal

# Listus extension
node scripts/generate-extension-test.mjs service ListService listus shared services
node scripts/generate-extension-test.mjs component ListItemComponent listus components list-item

# Schedulus extension
node scripts/generate-extension-test.mjs service ScheduleService schedulus shared services
node scripts/generate-extension-test.mjs component CalendarViewComponent schedulus components calendar-view

# Trackus extension
node scripts/generate-extension-test.mjs service TrackerService trackus shared services
node scripts/generate-extension-test.mjs component TrackerChartComponent trackus components tracker-chart
```

## Run Tests

```bash
# Single project
pnpm nx test project-name

# With pattern
pnpm nx test project-name --testPathPattern=service-name.spec.ts

# Watch mode
pnpm nx test project-name --watch

# All extensions
pnpm nx run-many --target=test --projects=*-shared,*-components,*-core

# Coverage
pnpm nx test project-name --coverage
```

## Template Variables

| Placeholder          | Replaces With   | Example            |
| -------------------- | --------------- | ------------------ |
| `{{ServiceName}}`    | PascalCase name | AssetService       |
| `{{service-name}}`   | kebab-case name | asset-service      |
| `{{ComponentName}}`  | PascalCase name | AssetFormComponent |
| `{{component-name}}` | kebab-case name | asset-form         |
| `{{extension-name}}` | Extension name  | assetus            |
| `{{sub-lib}}`        | Sub-library     | shared             |

## Sub-Libraries

- `shared` - Shared components and services
- `internal` - Internal implementation
- `core` - Core business logic
- `components` - UI components
- `pages` - Page components

## Time Savings

- ⏱️ Manual: 5-10 minutes per test
- ⚡ Template: 30 seconds per test
- 💰 **80-90% time reduction**

## Documentation

- Full guide: [docs/TESTING.md](TESTING.md)
- Examples: [docs/TESTING-EXAMPLES.md](TESTING-EXAMPLES.md)
- Templates: [templates/README.md](../templates/README.md)

## Common Patterns

### Service with API

```typescript
it('should call API', () => {
  const service = TestBed.inject(YourService);
  const api = TestBed.inject(SneatApiService);

  service.method();

  expect(api.post).toHaveBeenCalled();
});
```

### Component Input

```typescript
it('should accept input', () => {
  component.input = 'value';
  fixture.detectChanges();

  expect(component.input).toBe('value');
});
```

### Error Handling

```typescript
it('should handle errors', async () => {
  const api = TestBed.inject(SneatApiService);
  api.post = vi.fn().mockRejectedValue(new Error('API Error'));

  await expect(service.method()).rejects.toThrow('API Error');
});
```

---

📖 Keep this file handy for quick reference when writing tests!
