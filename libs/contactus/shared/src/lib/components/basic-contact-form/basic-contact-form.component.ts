import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonInput,
	IonItem,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import {
	ContactRole,
	ContactType,
	IContactWithBrief,
	ICreateContactBasicRequest,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-basic-contact-form',
	templateUrl: './basic-contact-form.component.html',
	imports: [IonItem, IonInput, FormsModule, IonButton, IonLabel, IonSpinner],
})
export class BasicContactFormComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly contactService = inject(ContactService);

	@Input() parentContact?: IContactWithBrief;
	@Input({ required: true }) space?: ISpaceContext;
	@Input() contactType?: ContactType;

	// @Input() contactRole?: ContactRole; // use contactRoles to support multiple roles
	@Input() contactRoles?: ContactRole[];

	@Output() readonly contactChange = new EventEmitter<IContactWithBrief>();
	@Output() readonly contactCreated = new EventEmitter<IContactWithBrief>();

	isSubmitting = false;
	isCreated = false;

	title = '';

	createContact(event: Event): void {
		event.stopPropagation();
		if (!this.space) {
			console.error('space is required');
			return;
		}
		if (!this.contactType) {
			console.error('contactType is required');
			return;
		}
		const request: ICreateContactBasicRequest = {
			spaceID: this.space.id,
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

		this.contactService.createContact(this.space, request).subscribe({
			next: (contact) => {
				this.isCreated = true;
				this.contactCreated.emit(contact);
			},
			error: (err: unknown) => {
				this.isSubmitting = false;
				this.errorLogger.logError(
					err,
					`Failed to create new [${this.contactType}]`,
				);
			},
		});
	}
}
