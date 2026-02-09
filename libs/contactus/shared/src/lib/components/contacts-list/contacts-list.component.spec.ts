import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ContactsListComponent } from './contacts-list.component';

describe('ContactsListComponent', () => {
	let component: ContactsListComponent;
	let fixture: ComponentFixture<ContactsListComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ContactsListComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ContactsListComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactsListComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$contacts', []);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
