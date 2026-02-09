import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import { InviteService } from '@sneat/contactus-services';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';

import { JoinSpacePageComponent } from './join-space-page.component';

describe('JoinSpacePage', () => {
	let component: JoinSpacePageComponent;
	let fixture: ComponentFixture<JoinSpacePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [JoinSpacePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'JoinSpacePageComponent' },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
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
					provide: SpaceNavService,
					useValue: {
						navigateForwardToSpacePage: vi.fn(),
						navigateToLogin: vi.fn(),
					},
				},
				{
					provide: InviteService,
					useValue: {
						getSpaceJoinInfo: vi.fn(() => of(null)),
						rejectPersonalInvite: vi.fn(() => of(null)),
					},
				},
				{
					provide: SneatAuthStateService,
					useValue: {
						authState: of({ status: 'notAuthenticated', user: null }),
					},
				},
				{
					provide: SneatUserService,
					useValue: {
						userState: of(null),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
			],
		})
			.overrideComponent(JoinSpacePageComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(JoinSpacePageComponent);
		fixture.componentRef.setInput('$space', { id: 'test' });
		fixture.detectChanges();
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
