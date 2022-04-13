import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecurringSlotsComponent} from './recurring-slots.component';

describe('RegularSlotsComponent', () => {
	let component: RecurringSlotsComponent;
	let fixture: ComponentFixture<RecurringSlotsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RecurringSlotsComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RecurringSlotsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
