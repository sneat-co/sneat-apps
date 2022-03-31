import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssetDatesComponent} from './asset-dates.component';

describe('AssetDatesComponent', () => {
	let component: AssetDatesComponent;
	let fixture: ComponentFixture<AssetDatesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetDatesComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDatesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
