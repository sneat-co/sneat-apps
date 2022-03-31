import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentNewPageComponent} from './document-new-page.component';

describe('DocumentNewPage', () => {
	let component: DocumentNewPageComponent;
	let fixture: ComponentFixture<DocumentNewPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DocumentNewPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DocumentNewPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
