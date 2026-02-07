import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekdayComponent } from './calendar-weekday.component';

describe('ScheduleWeekdayComponent', () => {
	let component: CalendarWeekdayComponent;
	let fixture: ComponentFixture<CalendarWeekdayComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CalendarWeekdayComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CalendarWeekdayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
