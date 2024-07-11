import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
	ContactRole,
	ContactType,
	IContactContext,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import {
	ContactSelectorService,
	IContactSelectorOptions,
} from '../contact-selector';

@Component({
	selector: 'sneat-subcontact-input',
	templateUrl: './subcontact-input.component.html',
})
export class SubcontactInputComponent {
	@Input() canReset = false;
	@Input() readonly = false;
	@Input({ required: true }) space?: ISpaceContext;
	@Input() label?: string;
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() role?: ContactRole;
	@Input() subLabel = 'by';
	@Input() subType?: ContactType;

	@Input() contact?: IContactContext;
	@Output() contactChange = new EventEmitter<IContactContext>();

	get labelText(): string {
		return (
			this.label ||
			(this.role && `${this.role[0].toUpperCase()}${this.role.substr(1)}`) ||
			'Contact'
		);
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
	) {}

	get contactLink(): string {
		return `/company/${this.space?.type}/${this.space?.id}/contact/${this.contact?.id}`;
	}

	reset(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.contact = undefined;
		this.contactChange.emit(undefined);
	}

	openContactSelector(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		console.log('ContactInputComponent.openContactSelector()');
		if (!this.space) {
			this.errorLogger.logError(
				'ContactInputComponent.openContactSelector(): team is required',
				undefined,
			);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			componentProps: {
				team: this.space,
				contactRole: this.role,
			},
		};
		this.contactSelectorService
			.selectSingleContactInModal(selectorOptions)
			.then((contact) => {
				console.log(
					'ContactInputComponent.openContactSelector() contact:',
					contact,
				);
				if (contact) {
					this.contactChange.emit(contact);
				}
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to open contact selector'),
			);
	}
}
