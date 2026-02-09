import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrderContainersSelectorComponent } from './order-containers-selector.component';

describe('OrderContainersSelectorComponent', () => {
	let component: OrderContainersSelectorComponent;
	let fixture: ComponentFixture<OrderContainersSelectorComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [OrderContainersSelectorComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(OrderContainersSelectorComponent, {
				set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(OrderContainersSelectorComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
