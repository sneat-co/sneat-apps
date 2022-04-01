import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssetAddVehiclePageComponent} from './asset-add-vehicle-page.component';

describe('AssetAddVehiclePage', () => {
	let component: AssetAddVehiclePageComponent;
	let fixture: ComponentFixture<AssetAddVehiclePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetAddVehiclePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetAddVehiclePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
