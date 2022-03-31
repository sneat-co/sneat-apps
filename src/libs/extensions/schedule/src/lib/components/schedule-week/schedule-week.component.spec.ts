import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScheduleWeekComponent} from './schedule-week.component';

describe('ScheduleWeekComponent', () => {
	let component: ScheduleWeekComponent;
	let fixture: ComponentFixture<ScheduleWeekComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ScheduleWeekComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ScheduleWeekComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
