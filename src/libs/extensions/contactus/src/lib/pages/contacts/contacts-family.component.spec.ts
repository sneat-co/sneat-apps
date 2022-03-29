import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactsFamilyComponent} from './contacts-family.component';

describe('ContactsFamilyComponent', () => {
	let component: ContactsFamilyComponent;
	let fixture: ComponentFixture<ContactsFamilyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContactsFamilyComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactsFamilyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
