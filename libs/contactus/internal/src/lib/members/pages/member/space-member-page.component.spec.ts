import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamMemberPageComponent } from './commune-member-page.component';

describe('CommuneMemberPage', () => {
	let component: TeamMemberPageComponent;
	let fixture: ComponentFixture<TeamMemberPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			declarations: [TeamMemberPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeamMemberPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
