import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RealEstateLocationComponent} from './real-estate-location.component';

describe('RealEstateLocationComponent', () => {
	let component: RealEstateLocationComponent;
	let fixture: ComponentFixture<RealEstateLocationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RealEstateLocationComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RealEstateLocationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
