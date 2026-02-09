import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAssetServicePageComponent } from './add-asset-service-page.component';
import { AssetComponentBaseParams } from '../asset-component-base-params';
import { provideAssetusMocks } from '../testing/test-utils';

describe('AddAssetServicePage', () => {
	let component: AddAssetServicePageComponent;
	let fixture: ComponentFixture<AddAssetServicePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [AddAssetServicePageComponent],
			providers: [...provideAssetusMocks(), AssetComponentBaseParams],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(AddAssetServicePageComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();
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
