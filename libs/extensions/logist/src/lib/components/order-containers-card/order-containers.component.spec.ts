import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { OrderContainersComponent } from './order-containers.component';

describe('OrderContainersComponent', () => {
	let component: OrderContainersComponent;
	let fixture: ComponentFixture<OrderContainersComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [OrderContainersComponent],
			providers: [{ provide: ModalController, useValue: { create: vi.fn() } }],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(OrderContainersComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(OrderContainersComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
