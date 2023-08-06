import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { createSetFocusToInput } from '@sneat/components';
import { ContactRole, ContactType, IAddress, IContactDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/team/contacts/services';
import { IContactContext, ICreateContactRequest, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-location-form',
	templateUrl: './location-form.component.html',
})
export class LocationFormComponent implements OnChanges {

	@Input() team?: ITeamContext;
	@Input() contactRole?: ContactRole;
	@Input() countryID = '';
	@Input() contact?: IContactContext;
	@Input() parentContact?: IContactContext;
	@Input() hideSubmitButton = false;
	@Input() label = 'Location details';
	@Input() contactType: ContactType = 'location';

	@Output() readonly contactChange = new EventEmitter<IContactContext>();
	@Output() readonly contactCreated = new EventEmitter<IContactContext>();

	@ViewChild('titleInput', { static: false }) titleInput?: IonInput;

	isCreating = false;

	protected readonly title = new FormControl<string>('', Validators.required);

	protected readonly form = new FormGroup({
		title: this.title,
	});

	addressText = '';

	get disabled(): boolean {
		return this.isCreating;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
	) {
	}

	private readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	onAddressChanged(address: IAddress): void {
		console.log('onAddressChanged()', address);
		if (!this.contact) {
			return;
		}
		this.contact = {
			...this.contact,
			dto: {
				...this.contact?.dto,
				type: this.contactType,
				address,
			},
		};
		this.contactChange.emit(this.contact);
	}

	onTitleChanged(): void {
		console.log('onTitleChanged()', this.title.value);
		if (!this.team) {
			return;
		}
		if (!this.contact) {
			const title = this.title.value || '';
			this.contact = {
				id: '',
				team: this.team,
				brief: {type: this.contactType, title},
				dto: {type: this.contactType, title},
			}
		}
		const title = this.title.value || '';
		const brief = (this.contact.brief || {}) as IContactContext;
		const dto = (this.contact.dto || {}) as IContactDto;
		this.contact = {
			...this.contact,
			brief: { ...brief, title },
			dto: { ...dto, title },
		};
		this.contactChange.emit(this.contact);
	}

	emitContactChange(): void {
		this.contactChange.emit(this.contact);
	}

	private readonly onContactCreated = (contact: IContactContext): void => {
		if (!this.team) {
			return;
		}
		contact = {
			...contact,
			parentContact: this.parentContact ? {id: this.parentContact.id, brief: this.parentContact, team: this.team} : undefined,
		};
		console.log('LocationFormComponent.onContactCreated()', contact);
		this.contact = contact;
		this.emitContactChange();
		this.contactCreated.emit(this.contact);
	};

	ngOnChanges(changes: SimpleChanges): void {
		console.log('LocationFormComponent.ngOnChanges()', changes);
		if (changes['contactType']) {
			if (!this.contact?.dto && this.contactType && this.team) {
				this.contact = {
					id: this.contact?.id || '',
					team: this.team,
					brief: { id: '', type: this.contactType, title: '' },
					dto: { type: this.contactType },
				};
				this.emitContactChange();
			}
		}
		if (changes['parentContact']) {
			if (this.parentContact?.countryID && !this.countryID) {
				this.countryID = this.parentContact.countryID;
				this.setFocusToTitle();
			}
		}
	}

	private setFocusToTitle(): void {
		setTimeout(() => {
			this.setFocusToInput(this.titleInput);
		}, 100);
	}

	submit(): void {
		const contactBrief = this.contact?.brief;
		if (!contactBrief) {
			alert('contact brief is not defined');
			return;
		}
		if (!this.team) {
			return;
		}
		// if (!this.parentContact) {
		// 	return;
		// }
		const { title } = contactBrief;
		const {address} = this.contact?.dto || {type: this.contactType};
		console.log('submit', title, address);
		if (!title) {
			alert('title is required');
			return;
		}
		if (!address) {
			alert('address is required');
			return;
		}
		if (!address.countryID) {
			alert('country is required');
			return;
		}
		if (!address.city) {
			alert('city is required');
			return;
		}
		if (!address.lines) {
			alert('address lines are required');
			return;
		}
		const request: ICreateContactRequest = {
			status: 'active',
			teamID: this.team.id,
			type: 'location',
			parentContactID: this.parentContact?.id,
			location: {
				title,
				address,
			},
		};
		this.isCreating = true;
		this.contactService.createContact(this.team, request)
			.subscribe({
				next: this.onContactCreated,
				error: (err: unknown) => {
					this.errorLogger.logError(err, 'Failed to create new contact');
					this.isCreating = false;
				},
			});
	}

}
