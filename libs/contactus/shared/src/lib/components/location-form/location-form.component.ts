import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { createSetFocusToInput } from '@sneat/components';
import {
	ContactRole,
	ContactType,
	IAddress,
	IContactBrief,
	IContactDto,
	IContactContext,
	ICreateContactRequest,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-location-form',
	templateUrl: './location-form.component.html',
})
export class LocationFormComponent implements OnChanges {
	@Input({ required: true }) space?: ISpaceContext;
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
	) {}

	private readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	onAddressChanged(address: IAddress): void {
		console.log('onAddressChanged()', address);
		if (!this.contact) {
			return;
		}
		this.contact = {
			...this.contact,
			dbo: {
				...this.contact?.dbo,
				type: this.contactType,
				address,
			},
		};
		this.contactChange.emit(this.contact);
	}

	onTitleChanged(): void {
		console.log('onTitleChanged()', this.title.value);
		if (!this.space) {
			return;
		}
		if (!this.contact) {
			const title = this.title.value || '';
			const brief: IContactBrief = { type: this.contactType, title };
			this.contact = {
				id: '',
				// team: this.team,
				dbo: brief,
				space: this.space,
			};
		}
		const title = this.title.value || '';
		const dbo = (this.contact?.dbo || {}) as IContactDto;
		this.contact = {
			...this.contact,
			dbo: { ...dbo, title },
		};
		this.contactChange.emit(this.contact);
	}

	private emitContactChange(): void {
		this.contactChange.emit(this.contact);
	}

	private readonly onContactCreated = (contact: IContactContext): void => {
		if (!this.space) {
			return;
		}
		// contact = { ...contact, parentContact: this.parentContact };
		console.log('LocationFormComponent.onContactCreated()', contact);
		this.contact = contact;
		this.emitContactChange();
		this.contactCreated.emit(contact);
	};

	ngOnChanges(changes: SimpleChanges): void {
		console.log('LocationFormComponent.ngOnChanges()', changes);
		if (changes['contactType']) {
			if (!this.contact?.dbo && this.contactType && this.space) {
				this.contact = {
					id: this.contact?.id || '',
					// team: this.team,
					dbo: { type: this.contactType },
					space: this.space,
				};
				this.emitContactChange();
			}
		}
		if (changes['parentContact']) {
			if (this.parentContact?.brief?.countryID && !this.countryID) {
				this.countryID = this.parentContact.brief?.countryID || '';
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
		const contactDto = this.contact?.dbo;
		if (!contactDto) {
			alert('contact brief is not defined');
			return;
		}
		if (!this.space) {
			return;
		}
		// if (!this.parentContact) {
		// 	return;
		// }
		const { title } = contactDto;
		const { address } = contactDto || { type: this.contactType };
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
			spaceID: this.space.id,
			type: 'location',
			parentContactID: this.parentContact?.id,
			location: {
				title,
				address,
			},
		};
		this.isCreating = true;
		this.contactService.createContact(this.space, request).subscribe({
			next: this.onContactCreated,
			error: (err: unknown) => {
				this.errorLogger.logError(err, 'Failed to create new contact');
				this.isCreating = false;
			},
		});
	}
}
