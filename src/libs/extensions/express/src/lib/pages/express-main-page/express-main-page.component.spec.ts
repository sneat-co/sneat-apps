import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressMainPageComponent } from './express-main-page.component';

describe('ExpressMainPageComponent', () => {
	let component: ExpressMainPageComponent;
	let fixture: ComponentFixture<ExpressMainPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExpressMainPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ExpressMainPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
