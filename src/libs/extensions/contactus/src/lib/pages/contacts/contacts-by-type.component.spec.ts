import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactsByTypeComponent} from './contacts-by-type.component';

describe('ContactsFamilyComponent', () => {
	let component: ContactsByTypeComponent;
	let fixture: ComponentFixture<ContactsByTypeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContactsByTypeComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactsByTypeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
