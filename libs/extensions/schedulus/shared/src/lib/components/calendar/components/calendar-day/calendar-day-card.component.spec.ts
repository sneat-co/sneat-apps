import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { CalendarStateService } from '../../calendar-state.service';
import { CalendarDayCardComponent } from './calendar-day-card.component';

describe('CalendarDayCardComponent', () => {
	let component: CalendarDayCardComponent;
	let fixture: ComponentFixture<CalendarDayCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CalendarDayCardComponent],
			providers: [
				{ provide: ClassName, useValue: 'ScheduleDayCardComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				CalendarStateService,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(CalendarDayCardComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
			})
			.compileComponents();
		fixture = TestBed.createComponent(CalendarDayCardComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$spaceDaysProvider', {
			getCalendarDay: vi.fn(() => ({
				date: new Date(),
				dateID: '2024-01-01',
				wd: 'mo',
				wdLongTitle: 'Monday',
				slots$: { pipe: () => ({ subscribe: vi.fn() }) },
				destroy: vi.fn(),
			})),
		});
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
