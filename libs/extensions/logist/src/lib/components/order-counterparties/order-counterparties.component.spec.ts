import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ContactsSelectorService } from '@sneat/contactus-shared';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistOrderService } from '../../services';
import { OrderCounterpartiesComponent } from './order-counterparties.component';

vi.mock('@angular/fire/firestore');

describe('OrderCounterpartiesComponent', () => {
	let component: OrderCounterpartiesComponent;
	let fixture: ComponentFixture<OrderCounterpartiesComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [OrderCounterpartiesComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: ContactsSelectorService,
					useValue: { selectSingleInModal: vi.fn(() => Promise.resolve(null)) },
				},
				LogistOrderService,
				{
					provide: SneatApiService,
					useValue: { post: vi.fn(() => of({})), delete: vi.fn(() => of({})) },
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(OrderCounterpartiesComponent, {
				set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(OrderCounterpartiesComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
