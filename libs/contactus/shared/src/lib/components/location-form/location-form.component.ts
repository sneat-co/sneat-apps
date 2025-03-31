import {
	Component,
	EventEmitter,
	Inject,
	input,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { AddressFormComponent } from '@sneat/components';
import { createSetFocusToInput } from '@sneat/ui';
import {
	ContactRole,
	ContactType,
	IAddress,
	IContactBrief,
	IContactDbo,
	ICreateContactRequest,
	IContactWithBrief,
	IContactWithOptionalDbo,
	IContactWithDboAndSpace,
	IContactContext,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import {
	computeSpaceRefFromSpaceContext,
	ISpaceContext,
} from '@sneat/space-models';

@Component({
	selector: 'sneat-location-form',
	templateUrl: './location-form.component.html',
	imports: [
		FormsModule,
		AddressFormComponent,
		ReactiveFormsModule,
		IonCard,
		IonItemDivider,
		IonItem,
		IonLabel,
		IonInput,
		IonCardContent,
		IonButton,
		IonIcon,
		IonSpinner,
	],
})
export class LocationFormComponent implements OnChanges {
	public readonly $space = input.required<ISpaceContext>();
	protected readonly $spaceRef = computeSpaceRefFromSpaceContext(this.$space);

	@Input() contactRole?: ContactRole;
	@Input() countryID = '';
	@Input() location?: IContactWithOptionalDbo;
	@Input() parentContact?: IContactContext;
	@Input() hideSubmitButton = false;
	@Input() label = 'Location details';
	@Input() contactType: ContactType = 'location';

	@Output() readonly locationChange =
		new EventEmitter<IContactWithOptionalDbo>();

	@Output() readonly locationCreated =
		new EventEmitter<IContactWithOptionalDbo>();

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
		if (!this.location) {
			return;
		}
		this.location = {
			...this.location,
			dbo: {
				...this.location?.dbo,
				type: this.contactType,
				address,
			},
		};
		this.locationChange.emit(this.location);
	}

	onTitleChanged(): void {
		console.log('onTitleChanged()', this.title.value);
		if (!this.location) {
			const title = this.title.value || '';
			const brief: IContactBrief = { type: this.contactType, title };
			this.location = {
				id: '',
				// team: this.team,
				brief,
			};
		}
		const title = this.title.value || '';
		const dbo = (this.location.dbo || this.location.brief) as IContactDbo;
		this.location = {
			...this.location,
			dbo: { ...dbo, title },
		};
		this.locationChange.emit(this.location);
	}

	private emitContactChange(): void {
		this.locationChange.emit(this.location);
	}

	private readonly onContactCreated = (
		contact: IContactWithDboAndSpace,
	): void => {
		// contact = { ...contact, parentContact: this.parentContact };
		console.log('LocationFormComponent.onContactCreated()', contact);
		this.location = contact;
		this.emitContactChange();
		this.locationCreated.emit(contact);
	};

	ngOnChanges(changes: SimpleChanges): void {
		console.log('LocationFormComponent.ngOnChanges()', changes);
		if (changes['contactType']) {
			if (!this.location?.dbo && this.contactType) {
				this.location = {
					id: this.location?.id || '',
					// team: this.team,
					brief: { type: this.contactType },
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
			throw new Error('Fix for standalone');
			// this.setFocusToInput(this.titleInput);
		}, 100);
	}

	submit(): void {
		const contactDto = this.location?.dbo;
		if (!contactDto) {
			alert('contact brief is not defined');
			return;
		}
		if (!this.$spaceRef().id) {
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
		const space = this.$spaceRef();
		const request: ICreateContactRequest = {
			status: 'active',
			spaceID: space.id,
			type: 'location',
			parentContactID: this.parentContact?.id,
			location: {
				title,
				address,
			},
		};
		this.isCreating = true;
		this.contactService.createContact(space, request).subscribe({
			next: this.onContactCreated,
			error: (err: unknown) => {
				this.errorLogger.logError(err, 'Failed to create new contact');
				this.isCreating = false;
			},
		});
	}
}
