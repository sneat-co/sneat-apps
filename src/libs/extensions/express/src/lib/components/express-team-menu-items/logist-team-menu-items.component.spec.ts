import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogistTeamMenuItemsComponent } from './logist-team-menu-items.component';

describe('ExpressMenuComponent', () => {
	let component: LogistTeamMenuItemsComponent;
	let fixture: ComponentFixture<LogistTeamMenuItemsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistTeamMenuItemsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistTeamMenuItemsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
