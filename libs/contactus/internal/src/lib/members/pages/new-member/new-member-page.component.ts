import { Component, computed, effect, signal, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import {
	IonBackButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonSegment,
	IonSegmentButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import {
	ContactusServicesModule,
	ContactusSpaceContextService,
} from '@sneat/contactus-services';
import { NewPetFormComponent } from '@sneat/contactus-shared';
import {
	AgeGroupID,
	ContactType,
	IContactusSpaceDboAndID,
	NewContactBaseDboAndSpaceRef,
	RoleSpaceMember,
} from '@sneat/contactus-core';
import {
	SpacePageBaseComponent,
	InviteLinksComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { filter, first, takeUntil } from 'rxjs';
import { NewMemberFormComponent } from './new-member-form.component';

type InviteType = 'personal' | 'mass';

@Component({
	imports: [
		ContactusServicesModule,
		NewMemberFormComponent,
		InviteLinksComponent,
		SpaceServiceModule,
		IonContent,
		IonSegment,
		IonSegmentButton,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonCard,
		IonCardContent,
		NewPetFormComponent,
	],
	selector: 'sneat-new-member-page',
	templateUrl: './new-member-page.component.html',
})
export class NewMemberPageComponent extends SpacePageBaseComponent {
	@ViewChild('nameInput', { static: false }) nameInput?: IonInput;

	protected onContactTypeChanged(event: CustomEvent): void {
		this.$contact.update((contact) => ({
			...contact,
			dbo: {
				...contact.dbo,
				type: event.detail.value as ContactType,
			},
		}));
	}

	protected readonly $inviteType = signal<InviteType>('mass');

	protected readonly $contact = signal<NewContactBaseDboAndSpaceRef>({
		space: { id: '' },
		dbo: {
			type: 'person',
			gender: 'unknown', // Undefined would indicate "loading" and gender form would be disabled.
			roles: [RoleSpaceMember],
		},
	});

	protected readonly $contactType = computed(() => this.$contact().dbo?.type);

	constructor() {
		super('NewMemberPageComponent');
		this.$defaultBackUrlSpacePath.set('members');
		const contactusSpaceContextService = new ContactusSpaceContextService(
			this.destroyed$,
			this.spaceIDChanged$,
		);
		effect(() => {
			const space = this.$spaceRef();
			this.$contact.update((contact) => ({
				...contact,
				space: space || { id: '' },
			}));
		});
		this.trackFirstSpaceTypeChanged();
		this.route.queryParams.subscribe((params) => {
			const group = params['group'];
			console.log('group', group);
			const setContactTypeAndAgeGroup = (
				contact: NewContactBaseDboAndSpaceRef,
				contactType: ContactType,
				ageGroup?: AgeGroupID,
			) => ({
				...contact,
				dbo: {
					...contact.dbo,
					type: contactType,
					ageGroup,
				},
			});
			switch (group) {
				case 'adults':
					this.$contact.update((contact) =>
						setContactTypeAndAgeGroup(contact, 'person', 'adult'),
					);
					break;
				case 'kids':
					this.$contact.update((contact) =>
						setContactTypeAndAgeGroup(contact, 'person', 'child'),
					);
					break;
				case 'pets':
					this.$contact.update((contact) =>
						setContactTypeAndAgeGroup(contact, 'animal'),
					);
					break;
				default:
					this.$contact.update((contact) =>
						setContactTypeAndAgeGroup(contact, 'person'),
					);
					break;
			}
			const roles = params['roles'] || '';
			if (roles) {
				this.$contact.update((contact) => ({
					...contact,
					dbo: {
						...contact.dbo,
						roles: roles.split(',').map((s: string) => s.trim()),
					},
				}));
			}
		});

		contactusSpaceContextService.contactusSpaceContext$
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (contactusTeam) => {
					this.contactusSpace = contactusTeam;
				},
			});
	}

	protected contactusSpace?: IContactusSpaceDboAndID;

	private readonly trackFirstSpaceTypeChanged = (): void => {
		console.log('NewMemberPageComponent.trackFirstSpaceTypeChanged()');
		try {
			this.spaceTypeChanged$
				.pipe(
					takeUntil(this.destroyed$),
					filter((v) => !!v),
					first(),
				)
				.subscribe({
					next: (spaceType) => {
						console.log(
							'NewMemberPageComponent: spaceTypeChanged$ =>',
							spaceType,
						);
						if (spaceType === 'family' && this.$inviteType() === 'mass') {
							this.$inviteType.set('personal');
						}
					},
					error: this.logErrorHandler('failed to process space type changes'),
				});
		} catch (e) {
			this.logError(e, 'failed to subscribe for first space type change');
		}
	};

	protected onTabChanged(event: CustomEvent): void {
		this.$inviteType.set(event.detail.value as InviteType);
	}
}
