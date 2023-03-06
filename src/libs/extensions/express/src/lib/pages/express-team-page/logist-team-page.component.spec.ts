import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogistTeamPageComponent } from './logist-team-page.component';

describe('ExpressMainPageComponent', () => {
	let component: LogistTeamPageComponent;
	let fixture: ComponentFixture<LogistTeamPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistTeamPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistTeamPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
