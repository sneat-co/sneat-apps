import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegularSlotFormComponent} from './regular-slot-form.component';

describe('RegularSlotFormComponent', () => {
	let component: RegularSlotFormComponent;
	let fixture: ComponentFixture<RegularSlotFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RegularSlotFormComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegularSlotFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
