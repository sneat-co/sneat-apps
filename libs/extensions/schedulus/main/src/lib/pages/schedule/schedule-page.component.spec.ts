import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePageComponent } from './schedule-page.component';

describe('SchedulePage', () => {
	let component: SchedulePageComponent;
	let fixture: ComponentFixture<SchedulePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SchedulePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SchedulePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('changes current date', () => {
		component.changeDay(1);
	});
});
