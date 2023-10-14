import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHappeningPageComponent } from './new-happening-page.component';

describe('NewHappeningPage', () => {
	let component: NewHappeningPageComponent;
	let fixture: ComponentFixture<NewHappeningPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NewHappeningPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewHappeningPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
