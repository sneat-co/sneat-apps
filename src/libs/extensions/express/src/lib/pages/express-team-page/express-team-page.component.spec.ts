import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressTeamPageComponent } from './express-team-page.component';

describe('ExpressMainPageComponent', () => {
	let component: ExpressTeamPageComponent;
	let fixture: ComponentFixture<ExpressTeamPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExpressTeamPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ExpressTeamPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
