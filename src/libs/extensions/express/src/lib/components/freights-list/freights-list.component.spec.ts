import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightsListComponent } from './freights-list.component';

describe('FreightsListComponent', () => {
	let component: FreightsListComponent;
	let fixture: ComponentFixture<FreightsListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FreightsListComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FreightsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
