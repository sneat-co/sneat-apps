import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorLogger } from '@sneat/logging';
import {
	NavController,
	ModalController,
	IonRouterOutlet,
	IonItem,
	IonAvatar,
	IonImg,
	IonSkeletonText,
	IonItemSliding,
	IonLabel,
	IonIcon,
	IonButtons,
	IonButton,
	IonItemOptions,
	IonItemOption,
} from '@ionic/angular/standalone';
import { of } from 'rxjs';

import { MembersListComponent } from './members-list.component';
import { SpaceNavService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { ContactService, ContactusNavService } from '@sneat/contactus-services';
import { ScheduleNavService } from '@sneat/mod-schedulus-core';

import { ContactRoleBadgesComponent } from '../contact-role-badges/contact-role-badges.component';
import { InlistAgeGroupComponent } from '../inlist-options/inlist-age-group.component';

describe('MembersListComponent', () => {
	let component: MembersListComponent;
	let fixture: ComponentFixture<MembersListComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MembersListComponent, RouterTestingModule],
			providers: [
				{ provide: SpaceNavService, useValue: {} },
				{ provide: NavController, useValue: {} },
				{ provide: SneatUserService, useValue: { userState: of({}) } },
				{ provide: ContactService, useValue: { setContactsStatus: vi.fn() } },
				{ provide: ScheduleNavService, useValue: {} },
				{ provide: ModalController, useValue: {} },
				{ provide: IonRouterOutlet, useValue: {} },
				{ provide: ContactusNavService, useValue: {} },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: jest.fn(() => vi.fn()),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(MembersListComponent, {
				remove: {
					imports: [
						IonItem,
						IonAvatar,
						IonImg,
						IonSkeletonText,
						IonItemSliding,
						IonLabel,
						IonIcon,
						IonButtons,
						IonButton,
						IonItemOptions,
						IonItemOption,
						ContactRoleBadgesComponent,
						InlistAgeGroupComponent,
					],
				},
				add: {
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(MembersListComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$members', []);
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
