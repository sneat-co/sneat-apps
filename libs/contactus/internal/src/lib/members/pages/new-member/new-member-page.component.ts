import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonInput } from '@ionic/angular';
import {
	ContactusServicesModule,
	ContactusSpaceContextService,
} from '@sneat/contactus-services';
import { ContactComponentBaseParams } from '@sneat/contactus-shared';
import {
	emptyMemberPerson,
	IContactusSpaceDboAndID,
	IMemberPerson,
} from '@sneat/contactus-core';
import {
	SpacePageBaseComponent,
	SpaceComponentBaseParams,
	InviteLinksComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { QRCodeComponent } from 'angularx-qrcode';
import { filter, first, takeUntil } from 'rxjs';
import { NewMemberFormComponent } from './new-member-form.component';

type Tab = 'personal' | 'mass';

@Component({
	selector: 'sneat-new-member-page',
	templateUrl: './new-member-page.component.html',
	providers: [SpaceComponentBaseParams, ContactComponentBaseParams],
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ContactusServicesModule,
		NewMemberFormComponent,
		InviteLinksComponent,
		SpaceServiceModule,
		QRCodeComponent,
	],
})
export class NewMemberPageComponent extends SpacePageBaseComponent {
	@ViewChild('nameInput', { static: false }) nameInput?: IonInput;

	protected readonly $tab = signal<Tab>('mass');

	protected readonly $member = signal<IMemberPerson>(emptyMemberPerson);

	public override get defaultBackUrl(): string {
		const t = this.space;
		const url = t ? `/space/${t.type}/${t.id}/members` : '';
		return url && this.defaultBackPage ? url + '/' + this.defaultBackPage : url;
	}

	constructor(params: ContactComponentBaseParams) {
		super('NewMemberPageComponent');
		const contactusSpaceContextService = new ContactusSpaceContextService(
			params.errorLogger,
			this.destroyed$,
			this.spaceIDChanged$,
			params.contactusSpaceService,
			this.userService,
		);
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
