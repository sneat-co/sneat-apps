import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuneDocumentPageComponent } from './commune-document-page.component';

describe('CommuneDocumentPage', () => {
	let component: CommuneDocumentPageComponent;
	let fixture: ComponentFixture<CommuneDocumentPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CommuneDocumentPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommuneDocumentPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
