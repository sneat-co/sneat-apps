import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { TopMenuService } from '@sneat/core';

import { LogistAppComponent } from './logist-app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [LogistAppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TopMenuService, useValue: { visibilityChanged: vi.fn() } },
      ],
    })
      .overrideComponent(LogistAppComponent, {
        set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LogistAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should handle missing ionSplitPane in ngAfterViewInit', () => {
    const fixture = TestBed.createComponent(LogistAppComponent);
    const app = fixture.componentInstance;
    app.ionSplitPane = null as any;
    expect(() => app.ngAfterViewInit()).not.toThrow();
  });

  it('should not disable split pane when hash is empty', () => {
    const fixture = TestBed.createComponent(LogistAppComponent);
    const app = fixture.componentInstance;
    app.ionSplitPane = { disabled: false } as any;
    app.ngAfterViewInit();
    expect(app.ionSplitPane.disabled).toBe(false);
  });

  it('should disable split pane when hash is #print', () => {
    const hashDesc = Object.getOwnPropertyDescriptor(location, 'hash')
      || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(location), 'hash');
    Object.defineProperty(location, 'hash', {
      get: () => '#print',
      configurable: true,
    });
    try {
      const fixture = TestBed.createComponent(LogistAppComponent);
      const app = fixture.componentInstance;
      app.ionSplitPane = { disabled: false } as any;
      app.ngAfterViewInit();
      expect(app.ionSplitPane.disabled).toBe(true);
    } finally {
      if (hashDesc) {
        Object.defineProperty(location, 'hash', hashDesc);
      }
    }
  });
});
