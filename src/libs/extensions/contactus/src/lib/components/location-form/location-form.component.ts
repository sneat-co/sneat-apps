import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { createSetFocusToInput } from '@sneat/components';
import { excludeEmpty, excludeUndefined } from '@sneat/core';
import { IContactDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ICreateContactRequest, ITeamContext } from '@sneat/team/models';
import { ContactService } from '../../services';

@Component({
	selector: 'sneat-location-form',
	templateUrl: './location-form.component.html',
})
export class LocationFormComponent implements OnChanges {

	@Input() team?: ITeamContext;
	@Input() hideSubmitButton = false;
	@Input() label = 'Location details';
	@Input() contactDto?: IContactDto;
	@Input() parentContact?: IContactContext;

	@Output() readonly contactDtoChange = new EventEmitter<IContactDto>();
	@Output() readonly contactCreated = new EventEmitter<IContactContext>();

	@ViewChild('titleInput', { static: false }) titleInput?: IonInput;

	isCreating = false;

	countryID = '';
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
		if (!this.contactDto) {
			throw new Error('onInputChange(): !this.contactDto');
		}
		this.contactDto = excludeEmpty({
			...this.contactDto,
			title: this.title,
			address: {
				countryID: this.countryID,
				lines: this.addressText.split('\n'),
			},
			countryID: this.countryID,
		});
		this.contactDtoChange.emit(this.contactDto);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactDto']) {
			if (this.contactDto?.countryID && !this.countryID) {
				this.countryID = this.contactDto.countryID;
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
		if (!this.contactDto) {
			return;
		}
		if (!this.team) {
			return;
		}
		if (!this.parentContact) {
			return;
		}
		const { title, countryID, address } = this.contactDto;
		console.log('submit', title, countryID, address);
		if (!title || !countryID || !address || !address.lines?.length) {
			alert('Please populate all required fields');
			return;
		}
		const request: ICreateContactRequest = {
			teamID: this.team.id,
			type: 'location',
			parentContactID: this.parentContact.id,
			location: {
				title,
				address,
			},
		};
		this.isCreating = true;
		this.contactService.createContact(this.team, request)
			.subscribe({
				next: newContact => {
					console.log('new location created with ID=' + newContact.id);
					this.contactCreated.emit(newContact)
				},
				error: (err: any) => {
					this.errorLogger.logError(err, 'Failed to create new contact');
					this.isCreating = false;
				},
			});
	}

}
