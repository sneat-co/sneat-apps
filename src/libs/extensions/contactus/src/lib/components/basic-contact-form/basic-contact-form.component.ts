import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ICreateContactBasicRequest, ICreateContactRequest, ITeamContext } from '@sneat/team/models';
import { ContactService } from '../../services';

@Component({
	selector: 'sneat-basic-contact-form',
	templateUrl: './basic-contact-form.component.html',
})
export class BasicContactFormComponent {
	@Input() parentContact?: IContactContext;
	@Input() team?: ITeamContext;
	@Input() contactType?: ContactType;
	@Input() contactRoles?: ContactRole[];

	@Output() readonly contactChange = new EventEmitter<IContactContext>();
	@Output() readonly contactCreated = new EventEmitter<IContactContext>();

	isSubmitting = false;

	title = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
	) {
	}

	createContact(event: Event): void {
		event.stopPropagation();
		if (!this.team || !this.contactType) {
			return;
		}
		const request: ICreateContactBasicRequest = {
			teamID: this.team.id,
			type: this.contactType,
			// type: this.contactType,
			parentContactID: this.parentContact?.id,
			roles: this.contactRoles,
			basic: {
				type: this.contactType,
				title: this.title,
				status: 'active',
			},
		};
		this.isSubmitting = true;

		this.contactService.createContact(this.team, request).subscribe({
			next: this.contactCreated.emit,
			error: err => {
				this.isSubmitting = false;
				this.errorLogger.logError(err, `Failed to create new [${this.contactType}]`)
			}
		});
	}
}
