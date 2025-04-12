import { Component, computed, effect, signal, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import {
	IonBackButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
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
	ContactType,
	emptyMemberPerson,
	IContactContext,
	IContactusSpaceDboAndID,
	IMemberPerson,
} from '@sneat/contactus-core';
import {
	SpacePageBaseComponent,
	InviteLinksComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { QRCodeComponent } from 'angularx-qrcode';
import { filter, first, takeUntil } from 'rxjs';
import { NewMemberFormComponent } from './new-member-form.component';

type Tab = 'personal' | 'mass';

@Component({
	imports: [
		ContactusServicesModule,
		NewMemberFormComponent,
		InviteLinksComponent,
		SpaceServiceModule,
		QRCodeComponent,
		IonContent,
		IonSegment,
		IonSegmentButton,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
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

	protected readonly $tab = signal<Tab>('mass');

	protected readonly $member = signal<IMemberPerson>(emptyMemberPerson);
	protected readonly $contact = signal<IContactContext>({
		id: '',
		dbo: { type: 'person' },
	} as IContactContext);

	protected readonly $contactType = computed(() => this.$contact().dbo?.type);

	constructor() {
		super('NewMemberPageComponent');
		this.$defaultBackUrlSpacePath.set('members');
		const contactusSpaceContextService = new ContactusSpaceContextService(
			this.destroyed$,
			this.spaceIDChanged$,
		);
		effect(() => {
			this.$contact.update((contact) => ({
				...contact,
				space: this.$spaceRef() || { id: '' },
			}));
		});
		this.trackFirstSpaceTypeChanged();
		this.route.queryParams.subscribe((params) => {
			const group = params['group'];
			console.log('group', group);
			switch (group) {
				case 'adults':
					this.$member.update((member) => ({
						...member,
						type: 'person',
						ageGroup: 'adult',
					}));
					break;
				case 'kids':
					this.$member.update((member) => ({
						...member,
						type: 'person',
						ageGroup: 'child',
					}));
					break;
				case 'pets':
					this.$member.update((member) => ({ ...member, type: 'animal' }));
					break;
				default:
					this.$member.update((member) => ({ ...member, type: 'person' }));
					break;
			}
			const roles = params['roles'] || '';
			if (roles) {
				this.$member.update((member) => ({
					...member,
					roles: roles.split(','),
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
						if (spaceType === 'family' && this.$tab() === 'mass') {
							this.$tab.set('personal');
						}
					},
					error: this.logErrorHandler('failed to process space type changes'),
				});
		} catch (e) {
			this.logError(e, 'failed to subscribe for first space type change');
		}
	};

	protected onTabChanged(event: CustomEvent): void {
		this.$tab.set(event.detail.value as Tab);
	}
}
