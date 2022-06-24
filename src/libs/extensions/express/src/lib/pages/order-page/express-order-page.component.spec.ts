import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressOrderPageComponent } from './express-order-page.component';

describe('FreightPageComponent', () => {
	let component: ExpressOrderPageComponent;
	let fixture: ComponentFixture<ExpressOrderPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExpressOrderPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ExpressOrderPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
