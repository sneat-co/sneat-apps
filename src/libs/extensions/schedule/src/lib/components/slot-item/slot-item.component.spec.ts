import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SlotItemComponent} from './slot-item.component';

describe('ActivityItemComponent', () => {
	let component: SlotItemComponent;
	let fixture: ComponentFixture<SlotItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SlotItemComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SlotItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
