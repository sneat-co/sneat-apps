import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegularHappeningPageComponent} from './regular-happening-page.component';

describe('RegularHappeningPage', () => {
	let component: RegularHappeningPageComponent;
	let fixture: ComponentFixture<RegularHappeningPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RegularHappeningPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RegularHappeningPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
