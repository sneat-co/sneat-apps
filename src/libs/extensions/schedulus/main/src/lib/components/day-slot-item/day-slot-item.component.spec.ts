import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DaySlotItemComponent} from './day-slot-item.component';

describe('ActivityItemComponent', () => {
	let component: DaySlotItemComponent;
	let fixture: ComponentFixture<DaySlotItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DaySlotItemComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DaySlotItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
