import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderCardComponent } from './order-card.component';

describe('FreightCardComponent', () => {
	let component: OrderCardComponent;
	let fixture: ComponentFixture<OrderCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [OrderCardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(OrderCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
