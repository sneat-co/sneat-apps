import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistTeamPageComponent } from './logist-team-page.component';

describe('LogistMainPageComponent', () => {
	let component: LogistTeamPageComponent;
	let fixture: ComponentFixture<LogistTeamPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [LogistTeamPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LogistTeamPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
