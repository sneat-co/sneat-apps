import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdersListComponent } from './orders-list.component';

describe('FreightsListComponent', () => {
	let component: OrdersListComponent;
	let fixture: ComponentFixture<OrdersListComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [OrdersListComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(OrdersListComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(OrdersListComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
