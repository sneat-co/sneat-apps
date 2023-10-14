import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappeningPageComponent } from './happening-page.component';

describe('RegularHappeningPage', () => {
	let component: HappeningPageComponent;
	let fixture: ComponentFixture<HappeningPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HappeningPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HappeningPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
