import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistOrderService, OrderNavService } from '../../services';
import { OrderPrintService } from '../../prints/order-print.service';
import { NewSegmentService } from '../new-segment/new-segment.service';
import { OrderTruckerComponent } from './order-trucker.component';

vi.mock('@angular/fire/firestore');

describe('OrderTruckerComponent', () => {
	let component: OrderTruckerComponent;
	let fixture: ComponentFixture<OrderTruckerComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [OrderTruckerComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				LogistOrderService,
				OrderPrintService,
				NewSegmentService,
				OrderNavService,
				{
					provide: ModalController,
					useValue: { create: vi.fn() },
				},
				{
					provide: NavController,
					useValue: {
						navigateForward: vi.fn(() => Promise.resolve(true)),
						navigateBack: vi.fn(() => Promise.resolve(true)),
					},
				},
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
			.overrideComponent(OrderTruckerComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(OrderTruckerComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
