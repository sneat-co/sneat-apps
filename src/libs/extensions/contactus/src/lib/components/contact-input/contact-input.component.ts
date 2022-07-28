import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { ContactSelectorService, IContactSelectorOptions } from '../contact-selector/contact-selector.service';

@Component({
	selector: 'sneat-contact-input',
	templateUrl: './contact-input.component.html',
})
export class ContactInputComponent {

	@Input() canChangeContact = true;
	@Input() canReset = false;
	@Input() readonly = false;
	@Input() team?: ITeamContext;
	@Input() label?: string;
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() contactRole?: ContactRole;
	@Input() contactType?: ContactType;
	@Input() subLabel = 'by';
	@Input() parentRole?: ContactRole;
	@Input() parentContact?: IContactContext;


	@Input() contact?: IContactContext;
	@Output() contactChange = new EventEmitter<IContactContext>();

	protected readonly labelText = () => this.label || 'Contact';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
	) {

	}

	get contactLink(): string {
		return `/company/${this.team?.type}/${this.team?.id}/contact/${this.contact?.id}` || '';
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
		if (!this.canChangeContact || this.readonly) {
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			team: this.team,
			parentRole: this.parentRole,
			contactRole: this.contactRole,
			contactType: this.contactType,
		};
		this.contactSelectorService.selectSingleContactInModal(selectorOptions)
			.then(contact => {
				console.log('ContactInputComponent.openContactSelector() contact:', contact);
				this.contact = contact || undefined;
				this.parentContact = contact?.parentContact;
				if (contact) {
					this.contactChange.emit(contact);
				}
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

}
