import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecurringItemComponent} from './recurring-item.component';

describe('ActivityItemComponent', () => {
	let component: RecurringItemComponent;
	let fixture: ComponentFixture<RecurringItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RecurringItemComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RecurringItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
