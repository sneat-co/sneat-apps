import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import {
	Gender,
	GenderFemale,
	GenderMale,
	GenderOther,
	GenderUndisclosed,
	GenderUnknown,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

const animationTimings = '150ms';

interface GenderOption {
	id: Gender;
	title: string;
	icon: string;
	emoji?: string;
}

const gendersOptions: readonly GenderOption[] = [
	{ id: GenderMale, title: 'Male', icon: 'man-outline', emoji: '👨' },
	{ id: GenderFemale, title: 'Female', icon: 'woman-outline', emoji: '👩' },
	{ id: GenderOther, title: 'Other', icon: 'person-outline' },
	{ id: GenderUnknown, title: 'Unknown', icon: 'person-circle-outline' },
	{ id: GenderUndisclosed, title: 'Undisclosed', icon: 'person' },
];

@Component({
	selector: 'sneat-gender-form',
	templateUrl: './gender-form.component.html',
	imports: [CommonModule, IonicModule, FormsModule, SneatPipesModule],
	animations: [
		trigger('radioOut', [
			transition(':leave', [animate(animationTimings, style({ height: 0 }))]),
		]),
		trigger('selectIn', [
			transition(':enter', [
				// style({ display: 'none' }), // initial styles
				animate(animationTimings),
			]),
		]),
	],
})
export class GenderFormComponent {
	protected readonly genders = gendersOptions;

	@Input() disabled = false;
	@Input({ required: true }) genderID?: Gender;
	@Output() genderChange = new EventEmitter<Gender>();

	// @ViewChild(IonRadioGroup, { static: true }) radioGroup?: IonRadioGroup;

	protected gender?: GenderOption; // we need it to show icon when gender selected

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger, // private readonly elemRef: ElementRef,
	) {}

	protected skip(): void {
		this.genderID = 'undisclosed';
		this.onGenderChanged();
	}

	onGenderChanged(): void {
		this.gender = this.genders.find((gender) => gender.id === this.genderID);
		this.genderChange.emit(this.genderID);
	}

	// private readonly setFocusToInput = createSetFocusToInput(this.errorLogger);
	// ngAfterViewInit(): void { // TODO: Find a way to set focus to a radio group
	// 	this.setFocusToInput(this.radioGroup, 100);
	// }
}
