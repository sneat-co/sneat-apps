import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { OrderContainersSelectorDialogComponent } from './order-containers-selector-dialog.component';

describe('OrderContainersSelectorDialogComponent', () => {
	let component: OrderContainersSelectorDialogComponent;
	let fixture: ComponentFixture<OrderContainersSelectorDialogComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [OrderContainersSelectorDialogComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(OrderContainersSelectorDialogComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(OrderContainersSelectorDialogComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
