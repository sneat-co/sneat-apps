import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsListItemComponent } from './contacts-list-item.component';

describe('ContactListItemComponent', () => {
	let component: ContactsListItemComponent;
	let fixture: ComponentFixture<ContactsListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContactsListItemComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactsListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
