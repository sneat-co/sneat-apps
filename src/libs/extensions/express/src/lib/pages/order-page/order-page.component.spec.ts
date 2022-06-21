import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPageComponent } from './order-page.component';

describe('FreightPageComponent', () => {
	let component: OrderPageComponent;
	let fixture: ComponentFixture<OrderPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [OrderPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(OrderPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
