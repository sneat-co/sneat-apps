import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogistOrderPageComponent } from './logist-order-page.component';

describe('FreightPageComponent', () => {
	let component: LogistOrderPageComponent;
	let fixture: ComponentFixture<LogistOrderPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistOrderPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistOrderPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
