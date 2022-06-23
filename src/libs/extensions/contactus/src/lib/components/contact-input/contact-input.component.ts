import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { ContactSelectorService, IContactSelectorOptions } from '../contact-selector/contact-selector.service';

@Component({
	selector: 'sneat-contact-input',
	templateUrl: './contact-input.component.html',
})
export class ContactInputComponent {

	@Input() readonly = false;
	@Input() team?: ITeamContext;
	@Input() label? = 'Contact';

	@Input() contact?: IContactContext;
	@Output() contactChange = new EventEmitter<IContactContext>();


	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
	) {

	}

	openContactSelector(): void {
		console.log('ContactInputComponent.openContactSelector()');
		if (!this.team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			team: this.team,
		}
		this.contactSelectorService.selectSingleContactsInModal(selectorOptions)
			.then(contact => {
				console.log('ContactInputComponent.openContactSelector() contact:', contact);
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

}
