import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetLiabilitiesComponent } from './asset-liabilities.component';
import { provideAssetusMocks } from '../testing/test-utils';

describe('AssetLiabilitiesComponent', () => {
	let component: AssetLiabilitiesComponent;
	let fixture: ComponentFixture<AssetLiabilitiesComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [AssetLiabilitiesComponent],
			providers: [...provideAssetusMocks()],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(AssetLiabilitiesComponent, {
				set: { imports: [], providers: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetLiabilitiesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
