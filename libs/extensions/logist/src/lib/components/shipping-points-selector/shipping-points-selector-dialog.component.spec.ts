import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular/standalone';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistOrderService } from '../../services';
import { ShippingPointsSelectorDialogComponent } from './shipping-points-selector-dialog.component';

vi.mock('@angular/fire/firestore');

describe('ShippingPointsSelectorDialogComponent', () => {
	let component: ShippingPointsSelectorDialogComponent;
	let fixture: ComponentFixture<ShippingPointsSelectorDialogComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ShippingPointsSelectorDialogComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				LogistOrderService,
				{
					provide: ModalController,
					useValue: {
						create: vi.fn(),
						dismiss: vi.fn(() => Promise.resolve()),
					},
				},
				{
					provide: SneatApiService,
					useValue: { post: vi.fn(() => of({})) },
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(ShippingPointsSelectorDialogComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(ShippingPointsSelectorDialogComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
