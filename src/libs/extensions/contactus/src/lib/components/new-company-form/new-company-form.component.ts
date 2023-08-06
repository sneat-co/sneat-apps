import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { excludeEmpty } from '@sneat/core';
import { ContactRole, ContactType, IContactContext, validateAddress } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService } from '@sneat/team/contacts/services';
import { ICreateContactCompanyRequest, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-new-company-form',
	templateUrl: './new-company-form.component.html',
})
export class NewCompanyFormComponent implements OnChanges {
	@Input() contactRoles?: ISelectItem[];
	@Input() team?: ITeamContext;
	@Input() contactRole?: ContactRole = undefined;
	@Input() hideRole = false;
	@Input() parentContact?: IContactContext;

	@Output() contactCreated = new EventEmitter<IContactContext>();

	protected readonly Object = Object;

	isCreating = false;

	contact?: IContactContext;

	readonly form = new FormGroup({
		role: new FormControl<ContactRole | undefined>(undefined, Validators.required),
		title: new FormControl<string>('', Validators.required),
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
		private readonly route: ActivatedRoute,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team'] && this.team) {
			if (this.contact) {
				this.contact = { ...this.contact, team: this.team };
			} else {
				this.contact = { id: '', team: this.team, dto: { type: 'company' } };
			}
		}
		if (changes['contactRole']) {
			this.form.patchValue({ role: this.contactRole });
		}
	}

	get formIsValid(): boolean {
		try {
			return !!this.contactRole && !!this.contact?.dto?.title && !!validateAddress(this.contact.dto?.address);
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
		if (!this.team) {
			alert('Contact team is a required field');
			return;
		}
		if (!this.contact?.dto?.title) {
			alert('Contact title is a required field');
			return;
		}
		if (!this.contactRole) {
			alert('Contact role is a required field');
			return;
		}
		try {
			const address = validateAddress(this.contact.dto?.address);
			const request: ICreateContactCompanyRequest = excludeEmpty({
				status: 'active',
				type: 'company' as ContactType,
				company: excludeEmpty({
					title: this.contact.dto?.title?.trim() || '',
					address,
					roles: [this.contactRole],
				}),
				roles: [this.contactRole],
				teamID: this.team.id,
			});
			this.isCreating = true;
			this.contactService.createContact(this.team, request).subscribe({
				next: contact => {
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
