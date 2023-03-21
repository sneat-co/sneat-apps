import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { excludeUndefined } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISaveEvent } from '../save-event';

@Component({
	selector: 'sneat-address-form',
	templateUrl: './address-form.component.html',
})
export class AddressFormComponent implements OnChanges {
	@Input() title = 'Address';
	@Input() address?: IAddress;
	@Output() readonly save = new EventEmitter<ISaveEvent<IAddress>>();

	protected saving = false;

	protected readonly countryCode = new FormControl('', [Validators.required]);
	protected readonly zipCode = new FormControl('', [Validators.pattern('[0-9 A-Z]{2,10}')]);
	protected readonly lines = new FormControl('', [Validators.required]);

	protected readonly form = new FormGroup({
		countryCode: this.countryCode,
		zipCode: this.zipCode,
		lines: this.lines,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	onCountryChanged(countryCode: string): void {
		this.countryCode.setValue(countryCode);
		this.countryCode.markAsDirty();
		if (!countryCode || countryCode === '--' || this.address?.countryID && this.address.countryID != countryCode) {
			this.zipCode.setValue('');
			this.lines.setValue('');
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['address']) {
			if (!this.countryCode.dirty) {
				this.countryCode.setValue(this.address?.countryID || '');
				this.countryCode.markAsPristine();
			}
			if (!this.zipCode.dirty) {
				this.zipCode.setValue(this.address?.zipCode || '');
				this.zipCode.markAsPristine();
			}
			if (!this.lines.dirty) {
				this.lines.setValue(this.address?.lines || '');
				this.lines.markAsPristine();
			}
		}
	}

	protected cancelChanges(): void {
		console.log('AddressFormComponent.cancelChanges()');
		this.countryCode.setValue(this.address?.countryID || '');
		this.countryCode.markAsPristine();
		this.zipCode.setValue(this.address?.zipCode || '');
		this.zipCode.markAsPristine();
		this.lines.setValue(this.address?.lines || '');
		this.lines.markAsPristine();
	}
	protected saveChanges(): void {
		console.log('AddressFormComponent.saveChanges()');
		const success = (): void => {
			this.saving = false;
			this.form.markAsPristine();
		};
		const error = (e: any): void => {
			this.saving = false;
			this.errorLogger.logError(e, 'Failed to save address');
		};
		this.saving = true;
		const countryID = this.countryCode.value;
		if (this.form.dirty && countryID) {
			const object: IAddress = excludeUndefined({
				countryID,
				zipCode: this.zipCode.value || undefined,
				lines: this.lines.value || undefined,
			});
			this.save.emit({ object, success, error });
		}
	}
}
