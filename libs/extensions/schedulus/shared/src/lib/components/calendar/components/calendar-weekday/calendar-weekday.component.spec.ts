import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CalendarFilterService } from '../../../calendar-filter.service';
import { ScheduleNavService } from '@sneat/mod-schedulus-core';

import { CalendarWeekdayComponent } from './calendar-weekday.component';

describe('ScheduleWeekdayComponent', () => {
	let component: CalendarWeekdayComponent;
	let fixture: ComponentFixture<CalendarWeekdayComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CalendarWeekdayComponent],
			providers: [
				{ provide: CalendarFilterService, useValue: { filter: of({}) } },
				{ provide: ScheduleNavService, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CalendarWeekdayComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$weekday', { id: 'test-wd' });
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
