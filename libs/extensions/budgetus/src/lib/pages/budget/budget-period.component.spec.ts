import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BudgetPeriodComponent } from './budget-period.component';

describe('BudgetPeriodComponent', () => {
	let component: BudgetPeriodComponent;
	let fixture: ComponentFixture<BudgetPeriodComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [BudgetPeriodComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(BudgetPeriodComponent, {
				set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(BudgetPeriodComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$showBy', 'event');
		fixture.componentRef.setInput('$period', 'weekly');
		fixture.componentRef.setInput('$liabilitiesMode', 'expenses');
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
