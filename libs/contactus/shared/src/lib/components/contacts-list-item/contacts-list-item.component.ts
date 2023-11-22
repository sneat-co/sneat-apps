import { Component, Inject, Input } from '@angular/core';
import { IIdAndBrief, IIdAndBriefAndOptionalDto } from '@sneat/core';
import { ContactRole, IContactBrief, IContactDto } from '@sneat/contactus-core';
import { IRelatedItem, IRelationships } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { ITeamContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { TeamNavService } from '@sneat/team-services';

@Component({
	selector: 'sneat-contacts-list-item',
	templateUrl: './contacts-list-item.component.html',
	styleUrls: ['./contacts-list-item.component.scss'],
})
export class ContactsListItemComponent {
	@Input() team?: ITeamContext;
	@Input() excludeRole?: ContactRole;
	@Input() contact?: IIdAndBriefAndOptionalDto<IContactBrief, IContactDto>;
	@Input() showAddress = false;
	@Input() hideRoles: string[] = [
		'--',
		'creator',
		'contributor',
		'owner',
		'team_member',
	];

	protected get relatedContacts(): readonly IIdAndBrief<IRelatedItem>[] {
		return zipMapBriefsWithIDs(this.contact?.dto?.related);
	}

	hideRole(role: string): boolean {
		return this.hideRoles.indexOf(role) >= 0 || role == this.excludeRole;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamNavService: TeamNavService,
		private readonly contactService: ContactService,
	) {}

	@Input() goContact = (contact?: IIdAndBrief<IContactBrief>): void => {
		if (!contact) {
			this.errorLogger.logError('no contact');
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('no team');
			return;
		}
		this.teamNavService
			.navigateForwardToTeamPage(this.team, `contact/${contact.id}`, {
				state: { contact },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to contact page'),
			);
	};

	@Input() goMember: (memberId: string, event: Event) => void = () => void 0;

	protected readonly contactID = (_: number, v: IIdAndBrief<IRelatedItem>) =>
		v.id;

	protected firstRelated(contactRelationships?: IRelationships): string {
		if (!contactRelationships) {
			return '';
		}
		const keys = Object.keys(contactRelationships);
		return keys.length ? keys[0] : '';
	}

	archiveContact(): void {
		console.log('ContactListItemComponent.removeContact()');
		if (!this.team) {
			return;
		}
		if (this.contact?.id) {
			this.contactService
				.setContactsStatus('archived', this.team.id, [this.contact.id])
				.subscribe({
					next: () => {
						console.log('ContactListItemComponent.removeContact() => done');
					},
					error: this.errorLogger.logError,
				});
		}
	}
}
