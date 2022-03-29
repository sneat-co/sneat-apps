//tslint:disable:no-unsafe-any
import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {IRecord, RxRecordKey} from 'rxstore';
import {CommuneBasePageParams} from '../../../../services/params';
import {listItemAnimations} from '../../../../animations/list-animations';
import {CommuneBasePage} from '../../../../pages/commune-base-page';
import {IContactDto} from '../../../../models/dto/dto-contact';
import {IMemberGroupDto} from '../../../../models/dto/dto-member';
import {ContactType} from '../../../../models/types';
import {IContactService} from '../../../../services/interfaces';
import {CommuneTopPage} from '../../../../pages/constants';

@Component({
	selector: 'contactus-contacts-page',
	templateUrl: './contacts-page.component.html',
	providers: [CommuneBasePageParams],
	animations: [listItemAnimations],
})
export class ContactsPageComponent extends CommuneBasePage {

	private contactsSubscription: Subscription;

	public allContacts: IContactDto[];
	public contacts: IContactDto[];
	public groups: IMemberGroupDto[];
	public segment: 'list' | 'groups' = 'list';
	public filter: string;
	public role?: ContactType;

	constructor(
		params: CommuneBasePageParams,
		private readonly contactsService: IContactService,
	) {
		super(CommuneTopPage.home, params);
		const role = location.pathname.match(/(applicant|landlord|tenant)/);
		if (role) {
			this.role = role[1] as ContactType;
		}
		this.allContacts = window.history.state.contacts as IContactDto[];

		if (this.allContacts) {
			this.applyFilter('', this.role);
		}
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
		const {role} = this;
		return role !== 'tenant' && role !== 'landlord';
	}

	applyFilter(filter: string, role?: string): void {
		filter = filter && filter.toLowerCase();
		this.filter = filter;
		this.contacts = !filter && !role
			? this.allContacts
			: this.allContacts.filter(c =>
				(!filter || c.title && c.title.toLowerCase()
					.indexOf(filter) >= 0)
				&& (!role || c.roles && c.roles.includes(role))
			);
	}

	protected onCommuneChanged(source?: string): void {
		super.onCommuneChanged(source);
		if (this.commune
			&& this.commune.dto && this.commune.dto.type === 'family'
			&& (!this.commune.dto.numberOf || !this.commune.dto.numberOf.contacts)) {
			this.segment = 'groups';
		}
		this.loadContacts('onCommuneChanged');
	}

	loadContacts(caller: string): void {
		console.log(`CommuneContactsPage.loadContacts(${caller})`);
		if (this.contactsSubscription) {
			this.contactsSubscription.unsubscribe();
		}
		if (this.communeRealId) {
			this.contactsSubscription = this.contactsService.watchByCommuneId(this.communeRealId)
				.subscribe(contacts => {
				this.allContacts = contacts;
				this.applyFilter(this.filter, this.role);
			});
		}
		this.subscriptions.push(this.contactsSubscription);
	}

	goContact = (contact: IContactDto): void => {
		this.navCtrl.navigateForward(['contact'], {
			queryParams: {id: contact.id},
			state: {
				contact,
				communeDto: this.commune && this.commune.dto,
			}
		})
			.catch(this.errorLogger.logError);
		// tslint:disable-next-line:semicolon
	};

	goNewContact = () => {
		this.navCtrl.navigateForward(['new-contact'], {queryParams: {commune: this.communeUrlId}})
			.catch(this.errorLogger.logError);
		// tslint:disable-next-line:semicolon
	};

	goMember(id: string, event: Event): boolean {
		event.stopPropagation();
		this.navCtrl.navigateForward(['member'], {
			queryParams: {id},
			state: {communeDto: this.commune && this.commune.dto}
		})
			.catch(this.errorLogger.logError);
		return false;
	}

	goGroup(group: IMemberGroupDto): void {
		this.navigateForward('group', {group: group.id}, {groupDto: group}, {excludeCommuneId: true});
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
