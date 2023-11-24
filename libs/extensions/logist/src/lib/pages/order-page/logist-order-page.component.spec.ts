import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistOrderPageComponent } from './logist-order-page.component';

describe('FreightPageComponent', () => {
	let component: LogistOrderPageComponent;
	let fixture: ComponentFixture<LogistOrderPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistOrderPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistOrderPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
