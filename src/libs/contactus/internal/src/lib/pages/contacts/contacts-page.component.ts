import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactsByTypeComponent, ContactsListModule } from '@sneat/contactus-shared';
import { listItemAnimations } from '@sneat/core';
import { FilterItemModule, ISelectItem, SneatPipesModule } from '@sneat/components';
import { setHrefQueryParam } from '@sneat/core';
import { ContactRole } from '@sneat/dto';
import { TeamComponentBaseParams, TeamCoreComponentsModule, TeamItemsBaseComponent } from '@sneat/team/components';
import { ContactusTeamService } from '@sneat/contactus-services';
import { IContactContext, IMemberGroupContext } from '@sneat/team/models';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sneat-contacts-page',
	templateUrl: './contacts-page.component.html',
	providers: [TeamComponentBaseParams],
	animations: [listItemAnimations],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TeamCoreComponentsModule,
		FilterItemModule,
		SneatPipesModule,
		ContactsListModule,
		ContactsByTypeComponent,
	],
})
export class ContactsPageComponent extends TeamItemsBaseComponent {

	public allContacts?: IContactContext[];
	public contactsByRole?: { [role: string]: IContactContext[] };
	public contacts?: IContactContext[];
	public groups: IMemberGroupContext[] = [];
	public segment: 'list' | 'groups' = 'groups';
	public filter = '';
	public role?: ContactRole;
	private contactsSubscription?: Subscription;

	readonly roles: ISelectItem[] = [
		{ id: '', title: 'All', iconName: 'people-outline' },
		{ id: 'freight_agent', title: 'Agents', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyers', iconName: 'cash-outline' },
		{ id: 'dispatcher', title: 'Dispatchers', iconName: 'business-outline' },
		{ id: 'trucker', title: 'Truckers', iconName: 'bus-outline' },
		{ id: 'shipping_line', title: 'Shipping lines', iconName: 'boat-outline' },
	];

	public contactsNumber(role: string): number {
		const roleContacts = (this.contactsByRole && this.contactsByRole[role]) ?? [];
		return roleContacts?.length ?? 0;
	}

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		// private readonly contactService: ContactService,
		private readonly contactusTeamService: ContactusTeamService,
	) {
		super('ContactsPageComponent', route, params, '');
		const role = location.pathname.match(/(applicant|landlord|tenant)/);
		if (role) {
			this.role = role[1] as ContactRole;
		}
		this.allContacts = window.history.state.contacts as IContactContext[];

		if (this.allContacts) {
			this.applyFilter('', this.role);
		}
		// this.teamIDChanged$.subscribe({
		// 	next: this.onTeamIDChangedWorker,
		// });
		route.queryParamMap.pipe(
			this.takeUntilNeeded(),
		).subscribe({
			next: q => {
				this.role = q.get('role') as ContactRole || undefined;
				this.applyFilter(this.filter, this.role);
			},
		});
		// this.teamDtoChanged$.subscribe({
		// 	next: this.onTeamDtoChanged,
		// })
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		this.contactsSubscription?.unsubscribe();
		if (this.contactsSubscription) {
			this.contactsSubscription.unsubscribe();
		}
		if (!this.team) {
			return;
		}

		this.contactusTeamService.watchContactBriefs(this.team).subscribe({
			next: contacts => {
				this.setTeamContacts(contacts || []);
				this.applyFilter(this.filter, this.role);
			},
		});
	}

	get pageTitle(): string {
		if (this.role) {
			return `${this.role[0].toUpperCase() + this.role.substr(1)}s`;
		}
		return 'Contacts';
	}

	get titleIcon(): string {
		switch (this.role) {
			case 'tenant':
				return '🤠';
			case 'landlord':
				return '🤴';
			case 'applicant':
				return '🤔';
			default:
				return '📇';
		}
	}

	get canAdd(): boolean {
		// tslint:disable-next-line:no-this-assignment
		const { role } = this;
		return role !== 'tenant' && role !== 'landlord';
	}

	applyFilter(filter: string, role?: ContactRole): void {
		console.log('ContactsPageComponent.applyFilter()', filter, role, this.allContacts);
		filter = filter && filter.toLowerCase();
		this.filter = filter;
		this.contacts = !filter && !role
			? this.allContacts
			: this.allContacts?.filter(c =>
				(!filter || c.brief?.title?.toLowerCase().includes(filter))
				&& (!role || c.brief?.roles && c?.brief.roles.includes(role)),
			);
	}

	protected readonly goContact = (contact?: IContactContext): void => {
		if (!contact) {
			this.errorLogger.logError('no contact');
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('no team');
			return;
		}
		this.teamParams.teamNavService.navigateForwardToTeamPage(this.team, `contact/${contact.id}`, {
			state: { contact },
		}).catch(this.errorLogger.logErrorHandler('failed to navigate to contact page'));
	};

	protected readonly goNewContact = (): void => {
		if (!this.team) {
			return;
		}
		let navResult: Promise<boolean>;

		if (this.team.type === 'family') {
			navResult = this.teamParams.teamNavService
				.navigateForwardToTeamPage(this.team, 'new-contact');
		} else {
			navResult = this.teamParams.teamNavService
				.navigateForwardToTeamPage(this.team, 'new-company', { queryParams: this.role ? { role: this.role } : undefined });
		}

		navResult.catch(this.errorLogger.logErrorHandler('failed to navigate to contact creation page'));
	};

	protected goMember(id: string, event: Event): boolean {
		event.stopPropagation();
		if (!this.team) {
			return false;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, `member/${id}`, {
				state: {
					member: { id },
				},
			})
			.catch(this.errorLogger.logErrorHandler('failed to navigate to contact creation page'));
		return false;
	}

	protected goGroup(group: IMemberGroupContext): void {
		if (!this.team) {
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, `group/${group.id}`, {
				state: {
					group: group,
				},
			})
			.catch(this.errorLogger.logErrorHandler('failed to navigate to contact creation page'));
	}

	protected id(i: number, record: { id: string }): string {
		return record.id;
	}

	private readonly setTeamContacts = (contacts: IContactContext[]): void => {
		console.log('ContactsPageComponent.setTeamContacts()', contacts);
		this.allContacts = contacts;
		const contactsByRole: { [role: string]: IContactContext[] } = { '': [] };
		contacts.forEach(c => {
			contactsByRole[''].push(c);
			c.brief?.roles?.forEach(role => {
				const roleContacts = contactsByRole[role as ContactRole];
				if (roleContacts) {
					roleContacts.push(c);
				} else {
					contactsByRole[role] = [c];
				}
			});
		});
		this.contactsByRole = contactsByRole;
		this.applyFilter(this.filter, this.role);
	};

	protected onRoleChanged(event: Event): void {
		event.stopPropagation();
		const url = setHrefQueryParam('role', this.role || '');
		history.replaceState(undefined, document.title, url);
		this.applyFilter(this.filter, this.role);
	}

	// roleSegmentButtonClicked(event: Event): void {
	// 	console.log('roleSegmentButtonClicked', event);
	// 	event.stopPropagation();
	// 	event.preventDefault();
	// 	const ce = event as CustomEvent;
	// 	if (ce.detail.value === this.role) {
	// 		this.role = undefined;
	// 	}
	// }

}

