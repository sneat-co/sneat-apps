import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleWeekdayComponent } from './schedule-weekday.component';

describe('ScheduleWeekdayComponent', () => {
	let component: ScheduleWeekdayComponent;
	let fixture: ComponentFixture<ScheduleWeekdayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ScheduleWeekdayComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ScheduleWeekdayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
