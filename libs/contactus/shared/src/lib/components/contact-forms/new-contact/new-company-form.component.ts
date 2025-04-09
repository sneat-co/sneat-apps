import { JsonPipe } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { excludeEmpty } from '@sneat/core';
import {
	ContactRole,
	ContactType,
	IContactBrief,
	validateAddress,
	IContactContext,
	ICreateContactCompanyRequest,
	IContactWithOptionalDbo,
	IContactWithDboAndSpace,
} from '@sneat/contactus-core';
import { ContactService } from '@sneat/contactus-services';
import { LocationFormComponent } from '../location-form';
import { NewContactBaseFormComponent } from './new-contact-base-form-component';

@Component({
	selector: 'sneat-new-company-form',
	templateUrl: './new-company-form.component.html',
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
})
export class NewCompanyFormComponent
	extends NewContactBaseFormComponent
	implements OnChanges
{
	@Input() contactRoles?: ISelectItem[];
	@Input() contactRole?: ContactRole = undefined;
	@Input() hideRole = false;
	@Input() parentContact?: IContactContext;

	@Output() contactCreated = new EventEmitter<IContactWithDboAndSpace>();

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

	constructor(
		private readonly contactService: ContactService,
		private readonly route: ActivatedRoute,
	) {
		super('NewCompanyFormComponent');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['$space'] && this.$space()) {
			if (!this.contact) {
				const brief: IContactBrief = { type: 'company' };
				this.contact = { id: '', brief: brief, dbo: brief };
				// } else {
				// 	this.contact = { ...this.contact, team: this.team };
			}
		}
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
				spaceID: this.$spaceID(),
			});
			this.isCreating = true;
			this.contactService.createContact(this.$space(), request).subscribe({
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
