import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleSlotFormComponent } from './single-slot-form.component';

describe('SingleSlotFormComponent', () => {
	let component: SingleSlotFormComponent;
	let fixture: ComponentFixture<SingleSlotFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [SingleSlotFormComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SingleSlotFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
