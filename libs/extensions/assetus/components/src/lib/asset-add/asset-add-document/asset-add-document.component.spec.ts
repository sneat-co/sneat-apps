import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssetAddDocumentComponent} from './asset-add-document.component';

describe('AssetAddDocumentComponent', () => {
	let component: AssetAddDocumentComponent;
	let fixture: ComponentFixture<AssetAddDocumentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetAddDocumentComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetAddDocumentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
