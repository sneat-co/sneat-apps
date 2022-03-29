import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamMemberPageComponent} from './commune-member-page.component';

describe('CommuneMemberPage', () => {
	let component: TeamMemberPageComponent;
	let fixture: ComponentFixture<TeamMemberPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TeamMemberPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TeamMemberPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
