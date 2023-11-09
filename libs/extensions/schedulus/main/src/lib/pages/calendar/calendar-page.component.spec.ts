import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPageComponent } from './calendar-page.component';

describe('SchedulePage', () => {
	let component: CalendarPageComponent;
	let fixture: ComponentFixture<CalendarPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CalendarPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CalendarPageComponent);
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
