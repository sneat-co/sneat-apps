import {Component, Input} from '@angular/core';
import {IRecord, RxRecordKey} from 'rxstore';
import {IContactDto} from '../../../../models/dto/dto-contact';
import {ContactType} from '../../../../models/types';
import {IContactService} from '../../../../services/interfaces';

@Component({
	selector: 'contactus-contact-item',
	templateUrl: './contact-list-item.component.html',
	styleUrls: ['./contact-list-item.component.scss'],
})
export class ContactListItemComponent {

	@Input() excludeRole: ContactType;
	@Input() contact: IContactDto;
	@Input() goContact: (c: IContactDto) => void;
	@Input() goMember: (memberId: string, event: Event) => void;

	constructor(
		private readonly contactService: IContactService,
	) {
	}

	removeContact(): void {
		console.log('ContactListItemComponent.removeContact()');
		if (this.contact.id) {
			this.contactService.deleteContact(this.contact.id)
				.subscribe(
					() => {
						console.log('ContactListItemComponent.removeContact() => done');
					},
					err => {
						alert(alert);
					});
		}
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
