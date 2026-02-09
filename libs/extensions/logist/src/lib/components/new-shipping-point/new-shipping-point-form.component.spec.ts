import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { LogistOrderService } from '../../services';
import { NewShippingPointFormComponent } from './new-shipping-point-form.component';

vi.mock('@angular/fire/firestore');

describe('NewShippingPointFormComponent', () => {
	let component: NewShippingPointFormComponent;
	let fixture: ComponentFixture<NewShippingPointFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [NewShippingPointFormComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				LogistOrderService,
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
			.overrideComponent(NewShippingPointFormComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(NewShippingPointFormComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
