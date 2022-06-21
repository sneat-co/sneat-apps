import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressTeamMenuItemsComponent } from './express-team-menu-items.component';

describe('ExpressMenuComponent', () => {
	let component: ExpressTeamMenuItemsComponent;
	let fixture: ComponentFixture<ExpressTeamMenuItemsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExpressTeamMenuItemsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ExpressTeamMenuItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
