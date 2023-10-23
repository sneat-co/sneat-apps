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
import { IIdAndBrief, IIdAndBriefAndDto, IIdAndDto } from '@sneat/core';
import {
	ContactRole,
	ContactType,
	IAddress,
	IContactBrief,
	IContactDto,
} from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { ICreateContactRequest, ITeamContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-location-form',
	templateUrl: './location-form.component.html',
})
export class LocationFormComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input() contactRole?: ContactRole;
	@Input() countryID = '';
	@Input() contact?: IIdAndDto<IContactDto>;
	@Input() parentContact?: IIdAndBrief<IContactBrief>;
	@Input() hideSubmitButton = false;
	@Input() label = 'Location details';
	@Input() contactType: ContactType = 'location';

	@Output() readonly contactChange = new EventEmitter<IIdAndDto<IContactDto>>();
	@Output() readonly contactCreated = new EventEmitter<
		IIdAndDto<IContactDto>
	>();

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
			const brief: IContactBrief = { type: this.contactType, title };
			this.contact = {
				id: '',
				// team: this.team,
				dto: brief,
			};
		}
		const title = this.title.value || '';
		const dto = (this.contact?.dto || {}) as IContactDto;
		this.contact = {
			...this.contact,
			dto: { ...dto, title },
		};
		this.contactChange.emit(this.contact);
	}

	emitContactChange(): void {
		this.contactChange.emit(this.contact);
	}

	private readonly onContactCreated = (
		contact: IIdAndBriefAndDto<IContactBrief, IContactDto>,
	): void => {
		if (!this.team) {
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
			if (!this.contact?.dto && this.contactType && this.team) {
				this.contact = {
					id: this.contact?.id || '',
					// team: this.team,
					dto: { type: this.contactType },
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
		const contactDto = this.contact?.dto;
		if (!contactDto) {
			alert('contact brief is not defined');
			return;
		}
		if (!this.team) {
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
			teamID: this.team.id,
			type: 'location',
			parentContactID: this.parentContact?.id,
			location: {
				title,
				address,
			},
		};
		this.isCreating = true;
		this.contactService.createContact(this.team, request).subscribe({
			next: this.onContactCreated,
			error: (err: unknown) => {
				this.errorLogger.logError(err, 'Failed to create new contact');
				this.isCreating = false;
			},
		});
	}
}
