import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CalendarFilterService } from '../../../calendar-filter.service';
import { ScheduleNavService } from '@sneat/mod-schedulus-core';
import { CalendarDataProvider } from '../../../../services/calendar-data-provider';

import { CalendarWeekComponent } from './calendar-week.component';

describe('ScheduleWeekComponent', () => {
  let component: CalendarWeekComponent;
  let fixture: ComponentFixture<CalendarWeekComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWeekComponent],
      providers: [
        { provide: CalendarFilterService, useValue: { filter: of({}) } },
        { provide: ScheduleNavService, useValue: {} },
        { provide: CalendarDataProvider, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWeekComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.componentRef.setInput('$week', { startDate: new Date() });
    fixture.componentRef.setInput('$spaceDaysProvider', {
      getCalendarDay: vi.fn(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
