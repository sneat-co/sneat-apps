import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressTeamMenuComponent } from './express-team-menu.component';

describe('ExpressMenuComponent', () => {
	let component: ExpressTeamMenuComponent;
	let fixture: ComponentFixture<ExpressTeamMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExpressTeamMenuComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ExpressTeamMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
