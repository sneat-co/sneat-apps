import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamContextComponent } from './team-context.component';

describe('TeamPageContextComponent', () => {
	let component: TeamContextComponent;
	let fixture: ComponentFixture<TeamContextComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TeamContextComponent],
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TeamContextComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
