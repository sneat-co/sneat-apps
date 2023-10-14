import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CountrySelectorComponent} from './country-selector.component';

describe('CountrySelectorComponent', () => {
	let component: CountrySelectorComponent;
	let fixture: ComponentFixture<CountrySelectorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CountrySelectorComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CountrySelectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
