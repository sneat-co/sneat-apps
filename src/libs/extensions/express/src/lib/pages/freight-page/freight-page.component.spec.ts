import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightPageComponent } from './freight-page.component';

describe('FreightPageComponent', () => {
	let component: FreightPageComponent;
	let fixture: ComponentFixture<FreightPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [FreightPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FreightPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
