import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TimerMeetingButtonComponent } from './timer-meeting-button.component';

describe('TimerMeetingButtonComponent', () => {
	let component: TimerMeetingButtonComponent;
	let fixture: ComponentFixture<TimerMeetingButtonComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [TimerMeetingButtonComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();

		fixture = TestBed.createComponent(TimerMeetingButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
