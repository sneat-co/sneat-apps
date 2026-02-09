import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { SneatUserService } from '@sneat/auth-core';
import { MemberService, InviteService } from '@sneat/contactus-services';
import { ErrorLogger } from '@sneat/core';
import { SneatApiService } from '@sneat/api';
import { RandomIdService } from '@sneat/random';
import { of } from 'rxjs';

import { InvitePersonalPageComponent } from './invite-personal-page.component';

describe('InvitePersonalPage', () => {
	let component: InvitePersonalPageComponent;
	let fixture: ComponentFixture<InvitePersonalPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [InvitePersonalPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{
					provide: Auth,
					useValue: {},
				},
				{
					provide: SneatUserService,
					useValue: {
						userState: of(null),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
				{
					provide: ActivatedRoute,
					useValue: {
						paramMap: of(new Map()),
						queryParamMap: of(new Map()),
						queryParams: of({}),
						params: of({}),
						snapshot: {
							paramMap: { get: () => null },
							queryParamMap: { get: () => null },
						},
					},
				},
				{
					provide: SneatApiService,
					useValue: { getAsAnonymous: vi.fn(() => of({})) },
				},
				{
					provide: MemberService,
					useValue: { acceptPersonalInvite: vi.fn(() => of(null)) },
				},
				{
					provide: InviteService,
					useValue: { rejectPersonalInvite: vi.fn(() => of(null)) },
				},
				{ provide: NavController, useValue: { navigateRoot: vi.fn() } },
				{
					provide: RandomIdService,
					useValue: { newRandomId: vi.fn(() => 'random-id') },
				},
			],
		})
			.overrideComponent(InvitePersonalPageComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(InvitePersonalPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
