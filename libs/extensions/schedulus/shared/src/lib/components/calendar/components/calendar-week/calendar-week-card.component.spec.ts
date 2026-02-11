import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { CalendarStateService } from '../../calendar-state.service';
import { CalendarWeekCardComponent } from './calendar-week-card.component';

describe('CalendarWeekCardComponent', () => {
  let component: CalendarWeekCardComponent;
  let fixture: ComponentFixture<CalendarWeekCardComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekCardComponent],
      providers: [
        { provide: ClassName, useValue: 'ScheduleWeekCardComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        CalendarStateService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CalendarWeekCardComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(CalendarWeekCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.componentRef.setInput('$spaceDaysProvider', {});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
