import { Component, Inject, Input } from '@angular/core';
import { ContactRole } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team/models';
import { ContactService } from '../../services';

@Component({
	selector: 'sneat-contact-item',
	templateUrl: './contact-list-item.component.html',
	styleUrls: ['./contact-list-item.component.scss'],
})
export class ContactListItemComponent {

	@Input() excludeRole?: ContactRole;
	@Input() contact?: IContactContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
	) {
	}

	@Input() goContact: (c?: IContactContext) => void = () => void 0;

	@Input() goMember: (memberId: string, event: Event) => void = () => void 0;

	removeContact(): void {
		console.log('ContactListItemComponent.removeContact()');
		if (this.contact?.id) {
			this.contactService.deleteContact(this.contact)
				.subscribe({
					next: () => {
						console.log('ContactListItemComponent.removeContact() => done');
					},
					error: this.errorLogger.logError,
				});
		}
	}

	id(i: number, record: { id: string }): string {
		return record.id;
	}
}
