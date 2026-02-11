import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { CalendarWeekTabComponent } from './calendar-week-tab.component';

describe('CalendarWeekTabComponent', () => {
  let component: CalendarWeekTabComponent;
  let fixture: ComponentFixture<CalendarWeekTabComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekTabComponent],
      providers: [
        { provide: ClassName, useValue: 'CalendarWeekTabComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CalendarWeekTabComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(CalendarWeekTabComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.componentRef.setInput('$spaceDaysProvider', {});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
