import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssetLiabilitiesComponent} from './asset-liabilities.component';

describe('AssetLiabilitiesComponent', () => {
	let component: AssetLiabilitiesComponent;
	let fixture: ComponentFixture<AssetLiabilitiesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetLiabilitiesComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetLiabilitiesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
