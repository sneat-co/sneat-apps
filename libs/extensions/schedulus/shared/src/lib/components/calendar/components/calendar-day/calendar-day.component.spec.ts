import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDayComponent } from './calendar-day.component';

describe('ScheduleDayComponent', () => {
	let component: CalendarDayComponent;
	let fixture: ComponentFixture<CalendarDayComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [CalendarDayComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CalendarDayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
