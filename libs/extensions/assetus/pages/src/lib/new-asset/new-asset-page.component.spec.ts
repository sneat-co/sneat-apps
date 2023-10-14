import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssetPageComponent } from './new-asset-page.component';

describe('AssetNewPage', () => {
	let component: NewAssetPageComponent;
	let fixture: ComponentFixture<NewAssetPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NewAssetPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewAssetPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
