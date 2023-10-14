import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilsPageComponent } from './pupils-page.component';

describe('PupilsPage', () => {
	let component: PupilsPageComponent;
	let fixture: ComponentFixture<PupilsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PupilsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PupilsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
