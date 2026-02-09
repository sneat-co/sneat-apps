import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';

import { UserProfilePageComponent } from './user-profile-page.component';

describe('UserProfilePage', () => {
	let component: UserProfilePageComponent;
	let fixture: ComponentFixture<UserProfilePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [UserProfilePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: SneatUserService,
					useValue: {
						userState: of({ status: 'notAuthenticated', record: null }),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
			],
		})
			.overrideComponent(UserProfilePageComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(UserProfilePageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
