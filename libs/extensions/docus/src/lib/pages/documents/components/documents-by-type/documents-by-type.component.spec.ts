import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsByTypeComponent } from './documents-by-type.component';

describe('DocumentsByTypeComponent', () => {
	let component: DocumentsByTypeComponent;
	let fixture: ComponentFixture<DocumentsByTypeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DocumentsByTypeComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DocumentsByTypeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
