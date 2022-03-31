import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsListComponent} from './documents-list.component';

describe('DocumentsListComponent', () => {
	let component: DocumentsListComponent;
	let fixture: ComponentFixture<DocumentsListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DocumentsListComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DocumentsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
