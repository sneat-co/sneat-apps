import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { IContactContext, ICreateContactBasicRequest, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-basic-contact-form',
	templateUrl: './basic-contact-form.component.html',
})
export class BasicContactFormComponent {
	@Input() parentContact?: IContactContext;
	@Input() team?: ITeamContext;
	@Input() contactType?: ContactType;

	// @Input() contactRole?: ContactRole; // use contactRoles to support multiple roles
	@Input() contactRoles?: ContactRole[];

	@Output() readonly contactChange = new EventEmitter<IContactContext>();
	@Output() readonly contactCreated = new EventEmitter<IContactContext>();

	isSubmitting = false;
	isCreated = false;

	title = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
	) {
	}

	createContact(event: Event): void {
		event.stopPropagation();
		if (!this.team) {
			console.error('team is required');
			return;
		}
		if (!this.contactType) {
			console.error('contactType is required');
			return;
		}
		const request: ICreateContactBasicRequest = {
			teamID: this.team.id,
			type: this.contactType,
			// type: this.contactType,
			roles: this.contactRoles,
			parentContactID: this.parentContact?.id,
			status: 'active',
			basic: {
				title: this.title,
			},
		};
		this.isSubmitting = true;

		this.contactService
			.createContact(this.team, request)
			.subscribe({
				next: contact => {
					this.isCreated = true;
					this.contactCreated.emit(contact);
				},
				error: (err: unknown) => {
					this.isSubmitting = false;
					this.errorLogger.logError(err, `Failed to create new [${this.contactType}]`);
				},
			});
	}
}
