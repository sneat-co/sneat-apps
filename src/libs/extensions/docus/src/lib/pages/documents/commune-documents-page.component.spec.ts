import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommuneDocumentsPageComponent} from './commune-documents-page.component';

describe('CommuneDocumentsPage', () => {
	let component: CommuneDocumentsPageComponent;
	let fixture: ComponentFixture<CommuneDocumentsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CommuneDocumentsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommuneDocumentsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
