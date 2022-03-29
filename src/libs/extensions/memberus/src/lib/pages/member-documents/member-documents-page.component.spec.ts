import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MemberDocumentsPageComponent} from './member-documents-page.component';

describe('MemberDocumentsPage', () => {
	let component: MemberDocumentsPageComponent;
	let fixture: ComponentFixture<MemberDocumentsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MemberDocumentsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MemberDocumentsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
