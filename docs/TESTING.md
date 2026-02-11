# Testing Guide for Sneat Apps

This guide outlines the testing patterns and best practices for the Sneat Apps monorepo.

## Test Framework

We use **Vitest** with **@analogjs/vitest-angular** for testing Angular components and services.

## Test Structure

### Extension Modules

Extension modules are located in `libs/extensions/` and follow a modular structure:

- `shared` - Shared components and services
- `internal` - Internal implementation
- `components` - UI components
- `pages` - Page components
- `core` - Core business logic

## Test Templates

Test templates are available in the `templates/` directory to help you quickly create consistent tests.

### 1. Service Test Template

Use `templates/extension-service.spec.ts.template` for testing services.

**Pattern:**

```typescript
import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { YourService } from './your-service.service';

describe('YourService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [YourService, { provide: SneatApiService, useValue: { post: vi.fn() } }],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(YourService)).toBeTruthy();
  });
});
```

**Key Points:**

- Use `TestBed.configureTestingModule()` for dependency injection
- Mock dependencies using `useValue` with `vi.fn()` from Vitest
- Inject service using `TestBed.inject(ServiceName)`

### 2. Component Test Template

Use `templates/extension-component.spec.ts.template` for testing components.

**Pattern:**

```typescript
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { YourComponent } from './your-component.component';

describe('YourComponent', () => {
  let component: YourComponent;
  let fixture: ComponentFixture<YourComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [YourComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
      ],
    })
      .overrideComponent(YourComponent, {
        set: {
          imports: [],
          providers: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(YourComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

**Key Points:**

- Use `waitForAsync` for async setup
- Import component using standalone component syntax
- Use `CUSTOM_ELEMENTS_SCHEMA` to avoid errors with custom elements
- Override component to isolate testing
- Mock providers like `ErrorLogger`

### 3. Sanity Test Template

Use `templates/extension-sanity.spec.ts.template` for basic sanity checks.

**Pattern:**

```typescript
describe('libs/extensions/extension-name/sub-lib sanity', () => {
  it('should pass sanity check', () => {
    expect(true).toBe(true);
  });
});
```

**When to Use:**

- Ensuring test infrastructure is working
- Placeholder tests for future implementation
- Quick smoke tests

## Running Tests

### Run tests for a specific project:

```bash
pnpm nx test <project-name>
```

### Run tests for all projects:

```bash
pnpm nx run-many --target=test --all
```

### Run tests for affected projects:

```bash
pnpm nx affected --target=test
```

### Run tests in watch mode:

```bash
pnpm nx test <project-name> --watch
```

## Best Practices

### 1. Test Naming

- Test files should be co-located with source files
- Use `.spec.ts` extension for test files
- Name matches the file being tested: `service-name.service.spec.ts`

### 2. Test Organization

```typescript
describe('ServiceOrComponentName', () => {
  // Setup
  beforeEach(() => {
    /* configuration */
  });

  // Basic tests
  it('should create', () => {
    /* test */
  });

  // Feature tests grouped by functionality
  describe('methodName', () => {
    it('should handle valid input', () => {
      /* test */
    });
    it('should handle invalid input', () => {
      /* test */
    });
  });
});
```

### 3. Mocking Dependencies

Use Vitest's `vi.fn()` to create mock functions:

```typescript
const mockService = {
  method: vi.fn().mockResolvedValue({ data: 'test' }),
};
```

### 4. Testing Async Operations

Use `waitForAsync` or `fakeAsync` for testing async code:

```typescript
it('should handle async operation', waitForAsync(async () => {
  await component.asyncMethod();
  expect(component.result).toBe('expected');
}));
```

### 5. Component Testing

- Use `fixture.detectChanges()` to trigger change detection
- Access native element with `fixture.nativeElement`
- Test user interactions with `fixture.debugElement.query()`

### 6. Test Coverage

- Aim for meaningful test coverage, not just high percentages
- Focus on critical business logic
- Test edge cases and error conditions
- Use `scripts/list-uncovered-lines.mjs` to find uncovered code

## Test Template Usage

### Using Templates Manually

1. Copy the appropriate template from `templates/`
2. Replace placeholders:
   - `{{ServiceName}}` - PascalCase service name
   - `{{service-name}}` - kebab-case file name
   - `{{ComponentName}}` - PascalCase component name
   - `{{component-name}}` - kebab-case file name
   - `{{extension-name}}` - extension module name
   - `{{sub-lib}}` - sub-library name (shared, internal, etc.)

3. Add specific test cases for your implementation

### Example: Creating a Service Test

From template:

```typescript
import { {{ServiceName}} } from './{{service-name}}.service';
```

Becomes:

```typescript
import { AssetusService } from './assetus-service.service';
```

## Common Testing Patterns

### 1. Testing Services with API Calls

```typescript
it('should call API with correct parameters', () => {
  const mockApi = TestBed.inject(SneatApiService);
  const service = TestBed.inject(YourService);

  service.createItem({ name: 'test' });

  expect(mockApi.post).toHaveBeenCalledWith('endpoint', expect.objectContaining({ name: 'test' }));
});
```

### 2. Testing Component Inputs

```typescript
it('should accept input value', () => {
  component.inputProperty = 'test value';
  fixture.detectChanges();

  expect(component.inputProperty).toBe('test value');
});
```

### 3. Testing Component Outputs

```typescript
it('should emit event', () => {
  const spy = vi.fn();
  component.outputEvent.subscribe(spy);

  component.triggerEvent();

  expect(spy).toHaveBeenCalledWith('expected data');
});
```

### 4. Testing Error Handling

```typescript
it('should handle errors gracefully', async () => {
  const mockApi = TestBed.inject(SneatApiService);
  mockApi.post = vi.fn().mockRejectedValue(new Error('API Error'));

  const service = TestBed.inject(YourService);
  await expect(service.method()).rejects.toThrow('API Error');
});
```

## Troubleshooting

### Common Issues

**Issue: "Cannot find module" errors**

- Ensure all imports are correctly specified
- Check `tsconfig.spec.json` includes test files
- Verify path aliases in `tsconfig.json`

**Issue: "No provider for X" errors**

- Add missing provider to TestBed configuration
- Mock the dependency if not needed for test

**Issue: Tests timing out**

- Check for unresolved promises
- Increase timeout in test configuration
- Use `fakeAsync` and `tick()` for time-dependent tests

**Issue: "CUSTOM_ELEMENTS_SCHEMA" warnings**

- Add `CUSTOM_ELEMENTS_SCHEMA` to TestBed schemas
- This prevents errors for Ionic and other custom elements

## Extension Module Test Status

As of February 2026:

| Extension | Test Files | Status              |
| --------- | ---------- | ------------------- |
| assetus   | 32         | ✅ Good             |
| budgetus  | 4          | ⚠️ Needs more tests |
| debtus    | 3          | ⚠️ Needs more tests |
| docus     | 5          | ⚠️ Needs more tests |
| listus    | 12         | ✅ Good             |
| logist    | 75+        | ✅ Excellent        |
| schedulus | 58         | ✅ Excellent        |
| trackus   | 12         | ✅ Good             |

**Total: 200+ test files**

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Nx Testing Documentation](https://nx.dev/recipes/testing)
- Test Coverage Report: Run `pnpm nx test <project> --coverage`

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Use appropriate template from `templates/`
3. Follow existing patterns in similar modules
4. Ensure tests pass before committing
5. Aim for meaningful coverage of business logic

For questions or improvements to this guide, please create an issue or PR.
