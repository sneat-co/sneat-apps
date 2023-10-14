import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatesPageComponent } from './real-estates-page.component';

describe('RealEstatesPage', () => {
	let component: RealEstatesPageComponent;
	let fixture: ComponentFixture<RealEstatesPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RealEstatesPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RealEstatesPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
