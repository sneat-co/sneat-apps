import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { EnvironmentsPageComponent } from './environments-page.component';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';

describe('EnvironmentsPage', () => {
  let component: EnvironmentsPageComponent;
  let fixture: ComponentFixture<EnvironmentsPageComponent>;

  beforeEach(waitForAsync(async () => {
    Object.defineProperty(window, 'history', {
      value: { ...window.history, state: { projSummary: undefined } },
      writable: true,
      configurable: true,
    });
    await TestBed.configureTestingModule({
      imports: [EnvironmentsPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: DatatugNavContextService,
          useValue: {
            currentProject: of(undefined),
            currentEnv: of(undefined),
          },
        },
      ],
    })
      .overrideComponent(EnvironmentsPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EnvironmentsPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
