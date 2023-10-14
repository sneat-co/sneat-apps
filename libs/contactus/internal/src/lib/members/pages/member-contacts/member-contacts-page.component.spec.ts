import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberContactsPageComponent } from './member-contacts-page.component';

describe('MemberContactsPage', () => {
	let component: MemberContactsPageComponent;
	let fixture: ComponentFixture<MemberContactsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MemberContactsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MemberContactsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
