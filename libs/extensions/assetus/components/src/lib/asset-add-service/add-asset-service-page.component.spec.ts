import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetServicePageComponent } from './add-asset-service-page.component';

describe('AddAssetServicePage', () => {
	let component: AddAssetServicePageComponent;
	let fixture: ComponentFixture<AddAssetServicePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AddAssetServicePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddAssetServicePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
