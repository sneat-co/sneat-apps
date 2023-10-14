import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { countryFlagEmoji } from '@sneat/components';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import {
	ContactSelectorService,
	IContactSelectorOptions,
} from '../contact-selector';

@Component({
	selector: 'sneat-contact-input',
	templateUrl: './contact-input.component.html',
})
export class ContactInputComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input() disabled?: boolean;
	@Input() canChangeContact = true;
	@Input() canReset = false;
	@Input() readonly = false;
	@Input() label?: string;
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() contactRole?: ContactRole;
	@Input() contactType?: ContactType;
	@Input() subLabel = 'by';
	@Input() parentType?: ContactType;
	@Input() parentRole?: ContactRole;
	@Input() parentContact?: IContactContext;
	@Input() deleting = false;
	@Input() contact?: IContactContext;

	@Output() readonly contactChange = new EventEmitter<IContactContext>();

	protected readonly labelText = () =>
		this.label ||
		(this.contactRole &&
			this.contactRole[0].toUpperCase() + this.contactRole.substr(1)) ||
		'Contact';

	protected get showFlag(): boolean {
		return !!this.contact?.brief?.countryID || !!this.contact?.dto?.countryID;
	}

	protected get showParentFlag(): boolean {
		return (
			(!!this.parentRole || !!this.parentType) &&
			!!(
				this.parentContact?.brief?.countryID ||
				this.parentContact?.dto?.countryID
			)
		);
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
	) {}

	protected parentTitle(): string {
		return this.getTitle(this.showParentFlag, this.parentContact);
	}

	protected contactTitle(): string {
		return this.getTitle(this.showFlag, this.contact);
	}

	private getTitle(showFlag: boolean, contact?: IContactContext): string {
		if (!contact) {
			return '';
		}
		const title = contact?.brief?.title || '';
		const flag = showFlag
			? countryFlagEmoji(contact?.brief?.countryID || contact?.dto?.countryID) +
			  ' '
			: '';
		return flag + title;
	}

	ngOnChanges(changes: SimpleChanges): void {
		const contactChange = changes['contact'];
		if (contactChange) {
			const prevContact = contactChange.previousValue as
				| IContactContext
				| undefined;
			if (
				prevContact &&
				prevContact.id !== this.contact?.id &&
				!changes['parentContact']
			) {
				this.parentContact = undefined;
			}
		}
	}

	get contactLink(): string {
		return (
			`/company/${this.team?.type}/${this.team?.id}/contact/${this.contact?.id}` ||
			''
		);
	}

	reset(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		// this.contact = undefined;
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
			this.errorLogger.logError(
				'ContactInputComponent.openContactSelector(): team is required',
				undefined,
			);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			componentProps: {
				team: this.team,
				parentType: this.parentType,
				parentRole: this.parentRole,
				contactRole: this.contactRole,
				contactType: this.contactType,
			},
		};
		this.contactSelectorService
			.selectSingleContactInModal(selectorOptions)
			.then((contact) => {
				console.log(
					'ContactInputComponent.openContactSelector() contact:',
					contact,
				);
				this.contact = contact || undefined;
				this.parentContact = contact?.parentContact;
				if (contact) {
					this.contactChange.emit(contact);
				}
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to open contact selector'),
			);
	}
}
