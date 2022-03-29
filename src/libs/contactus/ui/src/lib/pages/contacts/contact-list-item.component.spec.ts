import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactListItemComponent} from './contact-list-item.component';

describe('ContactListItemComponent', () => {
	let component: ContactListItemComponent;
	let fixture: ComponentFixture<ContactListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContactListItemComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
