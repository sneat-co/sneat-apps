import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegularSlotsComponent} from './regular-slots.component';

describe('RegularSlotsComponent', () => {
	let component: RegularSlotsComponent;
	let fixture: ComponentFixture<RegularSlotsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RegularSlotsComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegularSlotsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
