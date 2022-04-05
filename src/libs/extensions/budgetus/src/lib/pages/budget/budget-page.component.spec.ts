import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BudgetPageComponent} from './budget-page.component';

describe('BudgetPage', () => {
	let component: BudgetPageComponent;
	let fixture: ComponentFixture<BudgetPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BudgetPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BudgetPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
