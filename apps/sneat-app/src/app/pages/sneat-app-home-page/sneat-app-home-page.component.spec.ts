import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, LOGGER_FACTORY } from '@sneat/core';

import { SneatAppHomePageComponent } from './sneat-app-home-page.component';

describe('SneatAppHomePageComponent', () => {
  let component: SneatAppHomePageComponent;
  let fixture: ComponentFixture<SneatAppHomePageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [SneatAppHomePageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SneatAuthStateService,
          useValue: { authState: of({ status: 'notAuthenticated' }) },
        },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: LOGGER_FACTORY,
          useValue: { getLogger: () => console },
        },
      ],
    })
      .overrideComponent(SneatAppHomePageComponent, {
        set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SneatAppHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
