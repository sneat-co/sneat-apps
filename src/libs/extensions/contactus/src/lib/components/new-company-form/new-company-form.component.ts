import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ISelectItem } from '@sneat/components';
import { excludeEmpty } from '@sneat/core';
import { ContactRole, ContactType, validateAddress } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ICreateContactCompanyRequest, ITeamContext } from '@sneat/team/models';
import { ContactService } from '../../services';

@Component({
	selector: 'sneat-new-company-form',
	templateUrl: './new-company-form.component.html',
})
export class NewCompanyFormComponent {
	@Input() contactRoles?: ISelectItem[];
	@Input() team?: ITeamContext;
	@Input() contactRole?: ContactRole = undefined;
	@Input() hideRole = false;
	@Input() contactType?: ContactType = undefined;

	@Output() contactCreated = new EventEmitter<IContactContext>();

	isCreating = false;

	contact?: IContactContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Inject(ContactService) private readonly contactService: ContactService,
		@Inject(ActivatedRoute) private readonly route: ActivatedRoute,
	) {
	}

	get formIsValid(): boolean {
		try {
			return !!this.contactType && !!this.contact?.dto?.title && !!validateAddress(this.contact.dto?.address);
		} catch (e) {
			return false;
		}
	}



	onContactChanged(contact: IContactContext): void {
		console.log('contact', contact);
		this.contact = contact;
	}

	create(): void {
		if (!this.team || !this.contactType) {
			return;
		}
		if (!this.contact?.dto?.title) {
			alert('Contact title is a required field');
			return;
		}
		if (!this.contactRole) {
			alert('Contact role is a required field');
			return;
		}
		try {
			const address = validateAddress(this.contact.dto?.address);
			const request: ICreateContactCompanyRequest = excludeEmpty({
				type: 'company',
				company: excludeEmpty({
					title: this.contact.dto?.title?.trim() || '',
					address,
					roles: [this.contactRole],
				}),
				roles: [this.contactRole],
				teamID: this.team.id,
			});
			this.isCreating = true;
			this.contactService.createContact(this.team, request).subscribe({
				next: contact => {
					console.log('created contact:', contact);
					this.contactCreated.emit(contact);
				},
				error: err => {
					this.errorLogger.logError(err, 'Failed to create contact');
					this.isCreating = false;
				},
			});
		} catch (e) {
			alert(e);
			return;
		}
	}

}
