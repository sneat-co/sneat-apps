import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleHappeningPageComponent} from './single-happening-page.component';

describe('SingleHappeningPage', () => {
	let component: SingleHappeningPageComponent;
	let fixture: ComponentFixture<SingleHappeningPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SingleHappeningPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SingleHappeningPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
