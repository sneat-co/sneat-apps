import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { excludeEmpty, excludeUndefined } from '@sneat/core';
import { IContactDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-location-form',
	templateUrl: './location-form.component.html',
})
export class LocationFormComponent {

	@Input() disabled = false;
	@Input() contactDto: IContactDto = {};

	@Output() readonly contactDtoChange = new EventEmitter<IContactDto>();

	countryID = '';
	title = '';
	address = '';

	constructor(
		@Inject(ErrorLogger) private readonly logger: IErrorLogger,
	) {
	}

	onInputChange(): void {
		this.contactDto = excludeEmpty({
			...this.contactDto,
			title: this.title,
			address: this.address,
			countryID: this.countryID,
		});
		this.contactDtoChange.emit(this.contactDto);
	}
}
