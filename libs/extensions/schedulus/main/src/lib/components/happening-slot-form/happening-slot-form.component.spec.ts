import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrinSlotFormComponent } from './regular-slot-form.component';

describe('RegularSlotFormComponent', () => {
	let component: RecurrinSlotFormComponent;
	let fixture: ComponentFixture<RecurrinSlotFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RecurrinSlotFormComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RecurrinSlotFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
