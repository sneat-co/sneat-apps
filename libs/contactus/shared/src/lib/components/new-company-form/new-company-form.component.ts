import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { excludeEmpty } from '@sneat/core';
import {
	ContactRole,
	ContactType,
	IContactBrief,
	validateAddress,
	IContactContext,
	ICreateContactCompanyRequest,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-new-company-form',
	templateUrl: './new-company-form.component.html',
})
export class NewCompanyFormComponent implements OnChanges {
	@Input() contactRoles?: ISelectItem[];
	@Input({ required: true }) space?: ISpaceContext;
	@Input() contactRole?: ContactRole = undefined;
	@Input() hideRole = false;
	@Input() parentContact?: IContactContext;

	@Output() contactCreated = new EventEmitter<IContactContext>();

	protected readonly Object = Object;

	protected isCreating = false;

	protected contact?: IContactContext;

	protected readonly form = new FormGroup({
		role: new FormControl<ContactRole | undefined>(
			undefined,
			Validators.required,
		),
		title: new FormControl<string>('', Validators.required),
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
		private readonly route: ActivatedRoute,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['space'] && this.space) {
			if (!this.contact) {
				const brief: IContactBrief = { type: 'company' };
				this.contact = { id: '', dbo: brief, space: this.space };
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
		} catch (e) {
			// console.error(e);
			return false;
		}
	}

	onContactChanged(contact: IContactContext): void {
		console.log('onContactChanged()', contact);
		this.contact = contact;
	}

	create(): void {
		console.log('create()', this.contactRole, this.contact);
		if (!this.space) {
			alert('Contact team is a required field');
			return;
		}
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
				spaceID: this.space.id,
			});
			this.isCreating = true;
			this.contactService.createContact(this.space, request).subscribe({
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
