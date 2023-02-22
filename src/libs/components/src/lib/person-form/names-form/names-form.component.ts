import {
	AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	AbstractControl,
	FormControl, FormGroup,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { excludeEmpty } from '@sneat/core';
import { IName, isNameEmpty } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { createSetFocusToInput } from '../../focus';
import { IFormField } from '@sneat/core';

const isNamesFormValid = (control: AbstractControl): ValidationErrors | null => {
	const formGroup = control as UntypedFormGroup;
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

export interface INamesFormFields {
	lastName?: IFormField;
}

const maxNameLenValidator = Validators.maxLength(50);

@Component({
	selector: 'sneat-names-form',
	templateUrl: './names-form.component.html',
})
export class NamesFormComponent implements OnChanges, AfterViewInit {
	@Input() name?: IName = {};
	@Input() isActive = true;
	@Input() disabled = false;
	@Input() fields?: INamesFormFields;
	@Input() showNextButton = false;


	@ViewChild('firstNameInput', { static: true }) firstNameInput?: IonInput;
	@ViewChild('lastNameInput', { static: true }) lastNameInput?: IonInput;
	@ViewChild('middleNameInput', { static: true }) middleNameInput?: IonInput;
	@ViewChild('fullNameInput', { static: true }) fullNameInput?: IonInput;

	// @ViewChild('nextButton', {static: false}) nextButton?: IonButton;

	@Output() readonly keyupEnter = new EventEmitter<Event>();
	@Output() readonly namesChanged = new EventEmitter<IName>();
	@Output() readonly next = new EventEmitter<Event>();

	private initialNameChange = true;
	private isFullNameChanged = false;
	private isViewInitiated = false;

	private inputToFocus?: IonInput;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	public readonly fullName = new FormControl<string>('', [
		// Validators.required, -- not required if user entered only first name for example. In future may require to be an option
		maxNameLenValidator,
	]);

	public readonly firstName = new FormControl<string>('', [
		maxNameLenValidator,
	]);

	public readonly middleName = new FormControl<string>('', [
		maxNameLenValidator,
	]);

	public readonly lastName = new FormControl<string>('', [
		maxNameLenValidator,
	]);

	public readonly namesForm = new FormGroup({
		fullName: this.fullName,
		firstName: this.firstName,
		lastName: this.lastName,
		middleName: this.middleName,
	}, isNamesFormValid);

	public get hasNames(): boolean {
		return !!(this.firstName.value || this.lastName.value || this.fullName.value);
	}

	private setFocusToInput(input: IonInput, delay = 333): void {
		const setFocusTo = createSetFocusToInput(this.errorLogger);
		setFocusTo(input, delay);
	};


	ngOnChanges(changes: SimpleChanges): void {
		if (changes['fields']) {
			this.onInputChangeFields();
		}
		if (changes['name']) {
			this.onInputChangeName();
		}
		if (changes['disabled']) {
			this.onInputChangeDisabled();
		}
	}

	private onInputChangeDisabled(): void {
		if (this.disabled) {
			this.namesForm.disable();
		} else {
			this.namesForm.enable();
		}
	}

	private onInputChangeName(): void {
		const name = this.name;
		if (name) {
			if (name.first) {
				this.firstName.setValue(name.first);
			}
			if (name.last) {
				this.lastName.setValue(name.last);
			}
			if (name.middle) {
				this.middleName.setValue(name.middle);
			}
			if (name.full) {
				this.fullName.setValue(name.full);
			}
		}
		if (this.initialNameChange) {
			this.initialNameChange = false;
			if (!this.firstName.value) {
				this.inputToFocus = this.firstNameInput;
			} else if (!this.lastName.value) {
				this.inputToFocus = this.lastNameInput;
			} else if (!this.middleName.value) {
				this.inputToFocus = this.middleNameInput;
			} else if (!this.fullName.value) {
				this.inputToFocus = this.fullNameInput;
			}
			if (this.isViewInitiated && this.inputToFocus) {
				this.setFocusToInput(this.inputToFocus);
			}
		}
	}

	private onInputChangeFields(): void {
		this.lastName.clearValidators();
		const validators = [maxNameLenValidator];
		if (this.fields?.lastName?.required) {
			validators.push(Validators.required);
			console.log('Last name is required field');
		} else {
			console.log('Last name is optional field');
		}
		this.lastName.addValidators(validators);
	}

	ngAfterViewInit(): void {
		this.isViewInitiated = true;
		if (this.inputToFocus) {
			this.setFocusToInput(this.inputToFocus);
		}
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
			first: this.firstName.value || '',
			last: this.lastName.value || '',
			middle: this.middleName.value || '',
			full: this.fullName.value || '',
		};
		if (this.isFullNameChanged && isNameEmpty(this.name)) {
			this.isFullNameChanged = false;
		}
		this.namesChanged.emit(this.name);
	}

	public names(): IName {
		return excludeEmpty({
			first: this.firstName.value || '',
			last: this.lastName.value || '',
			middle: this.lastName.value || '',
			full: this.fullName.value || '',
		});
	}

	private generateFullName(): string {
		const
			first = (this.firstName.value || '').trim(),
			middle = (this.middleName.value || '').trim(),
			last = (this.lastName.value || '').trim();
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
		if (this.canGoNext) {
			this.next.emit(event);
		}
	}

	public get canGoNext(): boolean {
		return !isNameEmpty(this.name);
	}

	public onNext(event: Event): void {
		this.next.emit(event);
	}
}
