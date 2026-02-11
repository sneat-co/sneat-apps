import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { CalendarFilterService } from '../../../calendar-filter.service';
import { CalendarFilterComponent } from './calendar-filter.component';

describe('CalendarFilterComponent', () => {
  let component: CalendarFilterComponent;
  let fixture: ComponentFixture<CalendarFilterComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarFilterComponent],
      providers: [
        { provide: ClassName, useValue: 'CalendarFilterComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        CalendarFilterService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CalendarFilterComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(CalendarFilterComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
