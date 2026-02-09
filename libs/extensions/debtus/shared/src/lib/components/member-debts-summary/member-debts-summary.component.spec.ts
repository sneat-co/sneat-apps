import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MemberDebtsSummaryComponent } from './member-debts-summary.component';

describe('MemberDebtsSummaryComponent', () => {
	let component: MemberDebtsSummaryComponent;
	let fixture: ComponentFixture<MemberDebtsSummaryComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MemberDebtsSummaryComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(MemberDebtsSummaryComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(MemberDebtsSummaryComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
