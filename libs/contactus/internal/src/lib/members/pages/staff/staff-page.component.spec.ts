import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPageComponent } from './staff-page.component';

describe('StaffPage', () => {
	let component: StaffPageComponent;
	let fixture: ComponentFixture<StaffPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StaffPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StaffPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
