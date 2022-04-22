import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecurringHappeningPageComponent} from './recurring-happening-page.component';

describe('RegularHappeningPage', () => {
	let component: RecurringHappeningPageComponent;
	let fixture: ComponentFixture<RecurringHappeningPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RecurringHappeningPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RecurringHappeningPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
