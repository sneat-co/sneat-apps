import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPageComponent } from './asset-page.component';

describe('AssetPage', () => {
	let component: AssetPageComponent;
	let fixture: ComponentFixture<AssetPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
