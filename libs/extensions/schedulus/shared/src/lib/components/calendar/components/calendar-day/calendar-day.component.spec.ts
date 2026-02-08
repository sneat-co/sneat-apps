import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CalendarFilterService } from '../../../calendar-filter.service';
import { ScheduleNavService } from '@sneat/mod-schedulus-core';

import { CalendarDayComponent } from './calendar-day.component';

describe('ScheduleDayComponent', () => {
	let component: CalendarDayComponent;
	let fixture: ComponentFixture<CalendarDayComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CalendarDayComponent],
			providers: [
				{ provide: CalendarFilterService, useValue: { filter: of({}) } },
				{ provide: ScheduleNavService, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CalendarDayComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$weekday', { id: 'test-wd' });
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
