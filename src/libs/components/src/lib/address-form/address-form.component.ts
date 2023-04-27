import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { excludeUndefined } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { createSetFocusToInput } from '../focus';
import { ISaveEvent } from '../save-event';

export interface IAddressFormControls {
	countryID: FormControl<string | null>;
	zip: FormControl<string | null>;
	state: FormControl<string | null>;
	city: FormControl<string | null>;
	lines: FormControl<string | null>;
}

export type AddressForm = FormGroup<IAddressFormControls>;

export interface AddressRequiredFields {
	zip?: boolean;
	state?: boolean;
	city?: boolean;
	lines?: boolean;
}

@Component({
	selector: 'sneat-address-form',
	templateUrl: './address-form.component.html',
})
export class AddressFormComponent implements OnChanges, OnInit {
	@Input() mode?: 'new' | 'edit';
	@Input() title = 'Address';
	@Input() address?: IAddress;
	@Input() requiredFields?: AddressRequiredFields;
	@Output() readonly save = new EventEmitter<ISaveEvent<IAddress>>();
	@Output() readonly addressChange = new EventEmitter<IAddress>();
	@Output() readonly formCreated = new EventEmitter<AddressForm>(); // TODO: there is should be a better way of doing this

	@ViewChild('zipInput', { static: false }) zipInput?: IonInput;

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	protected saving = false;

	protected readonly countryID = new FormControl('', [Validators.required]);
	protected readonly zip = new FormControl('', [Validators.pattern('[0-9 A-Z]{2,10}')]);
	readonly state = new FormControl<string>('', {
		validators: [
			Validators.minLength(2),
			Validators.maxLength(20)],
	});
	readonly city = new FormControl<string>('', {
		validators: [
			Validators.minLength(2),
			Validators.maxLength(20)],
	});
	protected readonly lines = new FormControl('', [
		Validators.maxLength(200),
	]);

	public readonly form: AddressForm = new FormGroup({
		countryID: this.countryID,
		zip: this.zip,
		state: this.state,
		city: this.city,
		lines: this.lines,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	ngOnInit(): void {
		this.formCreated.emit(this.form);
	}

	onCountryChanged(countryID: string): void {
		this.countryID.setValue(countryID);
		this.countryID.markAsDirty();
		if (!countryID || countryID === '--' || this.address?.countryID && this.address.countryID != countryID) {
			this.zip.setValue('');
			this.lines.setValue('');
		}
		this.address = {
			countryID: countryID,
			zipCode: this.zip.value || undefined,
			state: this.state.value || undefined,
		}
		this.addressChange.emit(this.address);
		setTimeout(() => this.setFocusToInput(this.zipInput), 100);
	}

	get mustAddress(): IAddress {
		return this.address || {countryID: ''};
	}

	onZipChanged(): void {
		const address = this.mustAddress;
		this.address = {...this.mustAddress, zipCode: this.zip.value || ''};
		console.log('AddressFormComponent.onZipChanged()', this.zip.value, address, this.address);
		this.addressChange.emit(this.address);
	}

	onStateChanged(): void {
		const address = this.mustAddress;
		this.address = {...address, state: this.state.value || ''};
		console.log('AddressFormComponent.onStateChanged()', this.state.value, address, this.address);
		this.addressChange.emit(this.address);
	}

	onCityChanged(): void {
		this.address = {...this.mustAddress, city: this.city.value || ''};
		this.addressChange.emit(this.address);
	}

	onLinesChanged(): void {
		this.address = {...this.mustAddress, lines: this.lines.value || ''};
		this.addressChange.emit(this.address);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['requiredFields'] && this.requiredFields) {
			if (this.requiredFields?.zip) {
				this.zip.setValidators([Validators.required]);
			}
			if (this.requiredFields?.lines) {
				this.lines.setValidators([Validators.required]);
			}
			if (this.requiredFields?.state) {
				this.state.setValidators([Validators.required]);
			}
			if (this.requiredFields?.city) {
				this.city.setValidators([Validators.required]);
			}
		}
		if (changes['address']) {
			if (!this.countryID.dirty) {
				this.countryID.setValue(this.address?.countryID || '');
				this.countryID.markAsPristine();
			}
			if (!this.zip.dirty) {
				this.zip.setValue(this.address?.zipCode || '');
				this.zip.markAsPristine();
			}
			if (!this.lines.dirty) {
				this.lines.setValue(this.address?.lines || '');
				this.lines.markAsPristine();
			}
		}
	}

	protected cancelChanges(): void {
		console.log('AddressFormComponent.cancelChanges()');
		this.countryID.setValue(this.address?.countryID || '');
		this.countryID.markAsPristine();
		this.zip.setValue(this.address?.zipCode || '');
		this.zip.markAsPristine();
		this.lines.setValue(this.address?.lines || '');
		this.lines.markAsPristine();
	}

	protected saveChanges(): void {
		console.log('AddressFormComponent.saveChanges()');
		const success = (): void => {
			this.saving = false;
			this.form.markAsPristine();
		};
		const error = (e: unknown): void => {
			this.saving = false;
			this.errorLogger.logError(e, 'Failed to save address');
		};
		this.saving = true;
		const countryID = this.countryID.value;
		if (this.form.dirty && countryID) {
			const object: IAddress = excludeUndefined({
				countryID,
				zipCode: this.zip.value || undefined,
				lines: this.lines.value || undefined,
			});
			this.save.emit({ object, success, error });
		}
	}
}
