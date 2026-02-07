import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HappeningSlotModalComponent } from './happening-slot-modal.component';

describe('SingleSlotFormComponent', () => {
	let component: HappeningSlotModalComponent;
	let fixture: ComponentFixture<HappeningSlotModalComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HappeningSlotModalComponent]}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HappeningSlotModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
