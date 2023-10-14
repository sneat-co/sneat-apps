import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetGroupPageComponent } from './asset-group-page.component';

describe('AssetGroupPage', () => {
	let component: AssetGroupPageComponent;
	let fixture: ComponentFixture<AssetGroupPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetGroupPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetGroupPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
