import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogistTeamMenuComponent } from './logist-team-menu.component';

describe('LogistMenuComponent', () => {
	let component: LogistTeamMenuComponent;
	let fixture: ComponentFixture<LogistTeamMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistTeamMenuComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistTeamMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
