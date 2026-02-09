import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { NavController } from '@ionic/angular/standalone';
import { SpaceNavService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { ContactusNavService } from '@sneat/contactus-services';
import { of } from 'rxjs';

import { InviteLinksComponent } from './invite-links.component';

describe('InviteLinksComponent', () => {
	let component: InviteLinksComponent;
	let fixture: ComponentFixture<InviteLinksComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [InviteLinksComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: NavController, useValue: {} },
				{ provide: SpaceNavService, useValue: {} },
				{
					provide: SneatUserService,
					useValue: { userChanged: of(undefined), userState: of({}) },
				},
				{
					provide: ContactusNavService,
					useValue: { navigateToAddMember: vi.fn() },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(InviteLinksComponent, {
				set: { imports: [], template: '' },
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(InviteLinksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
