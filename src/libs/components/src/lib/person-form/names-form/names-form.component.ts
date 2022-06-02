import {
	AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges,
	ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { excludeEmpty } from '@sneat/core';
import { IName, isNameEmpty } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { createSetFocusToInput } from '../../focus';

const isNamesFormValid = (control: AbstractControl): ValidationErrors | null => {
	const formGroup = control as FormGroup;
	const mustHave = function(name: string): string {
		const c = formGroup.controls[name];
		if (!c) {
			throw new Error(`form is missing control: "${name}"`);
		}
		return (c.value as string).trim();
	};
	const firstName = mustHave('firstName');
	const lastName = mustHave('lastName');
	const fullName = mustHave('fullName');
	if (!firstName && !lastName && !fullName) {
		return { 'fullName': 'If full name is not provided either first or last name or both should be supplied' };
	}
	if (firstName && lastName && !fullName)
		return { 'fullName': 'If first & last names are supplied the full name should be supplied as well' };
	return null;
};

@Component({
	selector: 'sneat-names-form',
	templateUrl: './names-form.component.html',
})
export class NamesFormComponent implements OnChanges, AfterViewInit {
	@Input() name?: IName = {};
	@Input() isActive = true;
	@Input() disabled = false;

	@ViewChild('firstNameInput', { static: true }) firstNameInput?: IonInput;
	@ViewChild('fullNameInput', { static: true }) fullNameInput?: IonInput;

	@Output() readonly keyupEnter = new EventEmitter<Event>();
	@Output() readonly namesChanged = new EventEmitter<IName>();

	private isFullNameChanged = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	public readonly fullName = new FormControl('', [
		// Validators.required, -- not required if user entered only first name for example. In future may require to be an option
		Validators.maxLength(50),
	]);

	public readonly firstName = new FormControl('', [
		Validators.maxLength(50),
	]);

	public readonly middleName = new FormControl('', [
		Validators.maxLength(50),
	]);

	public readonly lastName = new FormControl('', [
		Validators.maxLength(50),
	]);

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	public readonly namesForm = new FormGroup({
		fullName: this.fullName,
		firstName: this.firstName,
		lastName: this.lastName,
		middleName: this.middleName,
	}, isNamesFormValid);

	public get hasNames(): boolean {
		return this.firstName.value || this.lastName.value || this.fullName.value;
	}

	ngOnChanges(changes: SimpleChanges): void {
		const nameChange = changes['name'];
		if (nameChange && nameChange.currentValue) {
			const name = this.name;
			if (name) {
				if (name.first) {
					this.firstName.setValue(name.first?.trim());
				}
				if (name.last) {
					this.lastName.setValue(name.last?.trim());
				}
				if (name.middle) {
					this.middleName.setValue(name.middle?.trim());
				}
				if (name.full) {
					this.fullName.setValue(name.full?.trim())
				}
			}
		}
	}

	ngAfterViewInit(): void {
		this.setFocusToInput(this.firstNameInput, 333);
	}

	onNameChanged(event: Event): void {
		console.log('onNameChanged()', this.isFullNameChanged, this.firstName.value, this.lastName.value, event);
		if (!this.isFullNameChanged) {

			const fullName = this.generateFullName();

			if (fullName !== this.fullName.value) {
				this.fullName.setValue(fullName, {
					onlySelf: true,
					emitEvent: false,
					emitModelToViewChange: true,
					emitViewToModelChange: false,
				});
			}
		}
		this.setName();
	}

	private setName(): void {
		this.name = {
			first: this.firstName.value?.trim(),
			last: this.lastName.value?.trim(),
			middle: this.middleName.value?.trim(),
			full: this.fullName.value?.trim(),
		};
		if (this.isFullNameChanged && isNameEmpty(this.name)) {
			this.isFullNameChanged = false;
		}
		this.namesChanged.emit(this.name);
	}

	public names(): IName {
		return excludeEmpty({
			first: this.firstName.value?.trim(),
			last: this.lastName.value?.trim(),
			middle: this.lastName.value?.trim(),
			full: this.fullName.value?.trim(),
		});
	}

	private generateFullName(): string {
		const
			first = this.firstName.value.trim(),
			middle = this.middleName.value.trim(),
			last = this.lastName.value.trim();
		if (first && last || first && middle || middle && last) {
			return (first + ' ' + middle + ' ' + last)
				.replace('  ', ' ').trim();
		}
		return '';
	}

	onFullNameChanged(event: Event): void {
		console.log('onFullNameChanged()', this.firstName.value, this.lastName.value, event);
		if (this.isFullNameChanged) {
			this.setName();
		} else {
			const fullName = this.generateFullName();
			if (this.fullName.value?.trim() !== fullName) {
				this.isFullNameChanged = true;
			}
		}
	}

	public nameKeyupEnter(event: Event): void {
		if (this.namesForm?.valid) {
			this.keyupEnter.emit(event);
		}
	}
}
