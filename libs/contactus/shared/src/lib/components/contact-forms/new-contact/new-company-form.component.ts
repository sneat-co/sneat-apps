import { JsonPipe } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	Validators,
} from '@angular/forms';
import {
	IonButton,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonItem,
	IonLabel,
	IonList,
	IonSpinner,
} from '@ionic/angular/standalone';
import { ClassName, ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { excludeEmpty } from '@sneat/core';
import {
	ContactRole,
	ContactType,
	validateAddress,
	IContactContext,
	ICreateContactCompanyRequest,
	IContactWithOptionalDbo,
} from '@sneat/contactus-core';
import { ContactService } from '@sneat/contactus-services';
import { LocationFormComponent } from '../location-form';
import { NewContactFormBaseComponent } from './new-contact-form-base.component';

@Component({
	imports: [
		SelectFromListComponent,
		FormsModule,
		JsonPipe,
		IonItem,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonList,
		IonLabel,
		IonButton,
		IonSpinner,
		LocationFormComponent,
	],
	selector: 'sneat-new-company-form',
	templateUrl: './new-company-form.component.html',
	providers: [{ provide: ClassName, useValue: 'NewCompanyFormComponent' }],
})
export class NewCompanyFormComponent
	extends NewContactFormBaseComponent
	implements OnChanges
{
	private readonly contactService = inject(ContactService);

	@Input() contactRoles?: ISelectItem[];
	@Input() contactRole?: ContactRole = undefined;
	@Input() hideRole = false;
	@Input() parentContact?: IContactContext;

	protected readonly Object = Object;

	protected isCreating = false;

	protected contact?: IContactWithOptionalDbo;

	protected readonly form = new FormGroup({
		role: new FormControl<ContactRole | undefined>(
			undefined,
			Validators.required,
		),
		title: new FormControl<string>('', Validators.required),
	});

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactRole']) {
			this.form.patchValue({ role: this.contactRole });
		}
	}

	get formIsValid(): boolean {
		try {
			return (
				!!this.contactRole &&
				!!this.contact?.dbo?.title &&
				!!validateAddress(this.contact.dbo?.address)
			);
		} catch {
			// console.error(e);
			return false;
		}
	}

	onContactChanged(contact: IContactWithOptionalDbo): void {
		console.log('onContactChanged()', contact);
		this.contact = contact;
	}

	create(): void {
		console.log('create()', this.contactRole, this.contact);
		if (!this.contact?.dbo?.title) {
			alert('Contact title is a required field');
			return;
		}
		if (!this.contactRole) {
			alert('Contact role is a required field');
			return;
		}
		const spaceRef = this.$contact().space;
		try {
			const address = validateAddress(this.contact.dbo?.address);
			const request: ICreateContactCompanyRequest = excludeEmpty({
				status: 'active',
				type: 'company' as ContactType,
				company: excludeEmpty({
					title: this.contact.dbo?.title?.trim() || '',
					address,
					roles: [this.contactRole],
				}),
				roles: [this.contactRole],
				spaceID: spaceRef.id,
			});
			this.isCreating = true;
			this.contactService.createContact(spaceRef, request).subscribe({
				next: (contact) => {
					console.log('created contact:', contact);
					this.contactCreated.emit(contact);
				},
				error: (err: unknown) => {
					this.errorLogger.logError(err, 'Failed to create contact');
					this.isCreating = false;
				},
			});
		} catch (e) {
			alert(e);
			return;
		}
	}
}
