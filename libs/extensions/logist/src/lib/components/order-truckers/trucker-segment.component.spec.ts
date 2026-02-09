import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistOrderService } from '../../services';
import { OrderPrintService } from '../../prints/order-print.service';
import { TruckerSegmentComponent } from './trucker-segment.component';

vi.mock('@angular/fire/firestore');

describe('TruckerSegmentComponent', () => {
	let component: TruckerSegmentComponent;
	let fixture: ComponentFixture<TruckerSegmentComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [TruckerSegmentComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				LogistOrderService,
				OrderPrintService,
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
			.overrideComponent(TruckerSegmentComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(TruckerSegmentComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
