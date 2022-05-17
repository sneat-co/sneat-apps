import { AfterViewInit, Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { IName } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { createSetFocusToInput } from '../../focus';

@Component({
	selector: 'sneat-names-form',
	templateUrl: './names-form.component.html',
})
export class NamesFormComponent implements AfterViewInit {
	@Input() disabled = false;

	@ViewChild('firstNameInput', { static: true }) firstNameInput?: IonInput;
	@ViewChild('fullNameInput', { static: true }) fullNameInput?: IonInput;

	@Output() readonly keyupEnter = new EventEmitter<Event>();

	private isFullNameChanged = false;
	public isNameSet = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	public readonly fullName = new FormControl('', [
		// Validators.required,
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
	});

	public get hasNames(): boolean {
		return this.firstName.value || this.lastName.value || this.fullName.value;
	}

	ngAfterViewInit(): void {
		this.setFocusToInput(this.firstNameInput, 333);
	}

	onNameChanged(event: Event): void {
		console.log('onNameChanged()', this.firstName.value, this.lastName.value, event);
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
	}

	public names(): IName {
		return {
			first: this.firstName.value,
			last: this.lastName.value,
			middle: this.lastName.value,
			full: this.fullName.value,
		}
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
		if (!this.isFullNameChanged) {
			const fullName = this.generateFullName();
			if (this.fullName.value !== fullName) {
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
