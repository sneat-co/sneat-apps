import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactPageComponent} from './contact-page.component';

describe('CommuneContactPage', () => {
	let component: ContactPageComponent;
	let fixture: ComponentFixture<ContactPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContactPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
