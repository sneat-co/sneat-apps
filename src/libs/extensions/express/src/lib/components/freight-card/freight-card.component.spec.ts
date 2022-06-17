import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightCardComponent } from './freight-card.component';

describe('FreightCardComponent', () => {
	let component: FreightCardComponent;
	let fixture: ComponentFixture<FreightCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FreightCardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FreightCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
