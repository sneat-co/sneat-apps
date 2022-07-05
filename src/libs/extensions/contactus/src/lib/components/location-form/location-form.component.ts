import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { createSetFocusToInput } from '@sneat/components';
import { excludeEmpty, excludeUndefined } from '@sneat/core';
import { IContactDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-location-form',
	templateUrl: './location-form.component.html',
})
export class LocationFormComponent implements OnChanges {

	@Input() label = 'Location details';
	@Input() disabled = false;
	@Input() contactDto?: IContactDto;

	@Output() readonly contactDtoChange = new EventEmitter<IContactDto>();

	@ViewChild('titleInput', { static: false }) titleInput?: IonInput;

	countryID = '';
	title = '';
	address = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
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
			address: this.address,
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
}
