import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAddVehicleComponent } from './asset-add-vehicle.component';

describe('AssetAddVehicleComponent', () => {
	let component: AssetAddVehicleComponent;
	let fixture: ComponentFixture<AssetAddVehicleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetAddVehicleComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetAddVehicleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
