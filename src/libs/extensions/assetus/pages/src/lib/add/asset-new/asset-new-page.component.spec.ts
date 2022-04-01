import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssetNewPageComponent} from './asset-new-page.component';

describe('AssetNewPage', () => {
	let component: AssetNewPageComponent;
	let fixture: ComponentFixture<AssetNewPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetNewPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetNewPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
