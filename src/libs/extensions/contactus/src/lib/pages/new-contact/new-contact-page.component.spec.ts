import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewContactPageComponent} from './new-contact-page.component';

describe('ContactNewPage', () => {
	let component: NewContactPageComponent;
	let fixture: ComponentFixture<NewContactPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NewContactPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewContactPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
