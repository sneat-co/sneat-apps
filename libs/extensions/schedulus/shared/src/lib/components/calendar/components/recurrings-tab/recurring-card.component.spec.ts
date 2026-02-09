import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { HappeningService } from '../../../../services/happening.service';
import { RecurringCardComponent } from './recurring-card.component';

describe('RecurringCardComponent', () => {
	let component: RecurringCardComponent;
	let fixture: ComponentFixture<RecurringCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [RecurringCardComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: HappeningService, useValue: {} },
				{
					provide: SpaceNavService,
					useValue: { navigateForwardToSpacePage: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(RecurringCardComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
			})
			.compileComponents();
		fixture = TestBed.createComponent(RecurringCardComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
