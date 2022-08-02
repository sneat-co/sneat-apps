import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { createSetFocusToInput } from '@sneat/components';
import { excludeEmpty } from '@sneat/core';
import { ContactRole, ContactType, IContactDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ICreateContactRequest, ITeamContext } from '@sneat/team/models';
import { ContactService } from '../../services';

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

	title = '';
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

	onCountryChanged(): void {
		this.onInputChange();
		this.setFocusToTitle();
	}

	onInputChange(): void {
		if (!this.contact?.dto) {
			return;
		}
		if (!this.team) {
			return;
		}
		const lines = this.addressText.split('\n');
		const contactDto: IContactDto = excludeEmpty({
			...this.contact.dto,
			title: this.title,
			address: {
				countryID: this.countryID,
				lines: lines.length == 1 && !lines[0].trim() ? undefined : lines,
			},
			countryID: this.countryID,
		});
		this.contact = {
			id: this.contact.id,
			dto: contactDto,
			team: this.team,
		};
		this.contactChange.emit(this.contact);
	}

	emitContactChange(): void {
		this.contactChange.emit(this.contact);
	}

	private readonly onContactCreated = (contact: IContactContext): void => {
		contact = {
			...contact,
			parentContact: this.parentContact,
		};
		console.log('LocationFormComponent.onContactCreated()', contact);
		this.contact = contact;
		this.emitContactChange();
		this.contactCreated.emit(this.contact);
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('LocationFormComponent.ngOnChanges()', changes);
		if (changes['contactType']) {
			if (!this.contact?.dto && this.contactType && this.team) {
				this.contact = {
					id: this.contact?.id || '',
					team: this.team,
					dto: {type: this.contactType}
				}
				this.emitContactChange();
			}
		}
		if (changes['parentContact']) {
			if (this.parentContact?.dto?.countryID && !this.countryID) {
				this.countryID = this.parentContact.dto.countryID;
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
		const contactDto = this.contact?.dto
		if (!contactDto) {
			return;
		}
		if (!this.team) {
			return;
		}
		// if (!this.parentContact) {
		// 	return;
		// }
		const { title, countryID, address } = contactDto;
		console.log('submit', title, countryID, address);
		if (!title || !countryID || !address || !address.lines?.length) {
			alert('Please populate all required fields');
			return;
		}
		const request: ICreateContactRequest = {
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
				error: (err: any) => {
					this.errorLogger.logError(err, 'Failed to create new contact');
					this.isCreating = false;
				},
			});
	}

}
