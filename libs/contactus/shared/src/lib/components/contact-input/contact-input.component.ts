import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { countryFlagEmoji } from '@sneat/components';
import { IIdAndOptionalBriefAndOptionalDbo } from '@sneat/core';
import {
	ContactRole,
	ContactType,
	IContactBrief,
	IContactDbo,
	IContactContext,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { IContactSelectorOptions } from '../contacts-selector/contacts-selector.interfaces';
import { ContactsSelectorModule } from '../contacts-selector/contacts-selector.module';
import { ContactsSelectorService } from '../contacts-selector/contacts-selector.service';

@Component({
	selector: 'sneat-contact-input',
	templateUrl: './contact-input.component.html',
	imports: [
		RouterModule,
		ContactsSelectorModule,
		IonInput,
		IonItem,
		IonSpinner,
		IonIcon,
		IonButton,
		IonLabel,
		IonButtons,
	],
})
export class ContactInputComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly contactSelectorService = inject(ContactsSelectorService);

	@Input({ required: true }) space?: ISpaceContext;
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

	@Output() readonly contactChange = new EventEmitter<
		undefined | IContactContext
	>();

	protected readonly labelText = () =>
		this.label ||
		(this.contactRole &&
			this.contactRole[0].toUpperCase() + this.contactRole.substr(1)) ||
		'Contact';

	protected get showFlag(): boolean {
		return !!this.contact?.brief?.countryID;
	}

	protected get showParentFlag(): boolean {
		return (
			(!!this.parentRole || !!this.parentType) &&
			!!(
				this.parentContact?.brief?.countryID ||
				this.parentContact?.dbo?.countryID
			)
		);
	}

	protected parentTitle(): string {
		return this.getTitle(this.showParentFlag, this.parentContact);
	}

	protected contactTitle(): string {
		return this.getTitle(this.showFlag, this.contact);
	}

	private getTitle(
		showFlag: boolean,
		contact?: IIdAndOptionalBriefAndOptionalDbo<IContactBrief, IContactDbo>,
	): string {
		if (!contact) {
			return '';
		}
		const title = contact?.brief?.title || '';
		const flag = showFlag
			? countryFlagEmoji(contact?.brief?.countryID || contact?.dbo?.countryID) +
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
		return `/company/${this.space?.type}/${this.space?.id}/contact/${this.contact?.id}`;
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
		if (!this.space) {
			this.errorLogger.logError(
				'ContactInputComponent.openContactSelector(): team is required',
				undefined,
			);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			componentProps: {
				space: this.space, // TODO: switch to this.$space
				parentType: this.parentType,
				parentRole: this.parentRole,
				contactRole: this.contactRole,
				contactType: this.contactType,
			},
		};
		this.contactSelectorService
			.selectSingleInModal(selectorOptions)
			.then((contact) => {
				console.log(
					'ContactInputComponent.openContactSelector() contact:',
					contact,
				);
				this.contact = contact || undefined;
				// this.parentContact = contact?.parentContact;
				if (contact) {
					this.contactChange.emit(contact);
				}
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to open contact selector'),
			);
	}
}
