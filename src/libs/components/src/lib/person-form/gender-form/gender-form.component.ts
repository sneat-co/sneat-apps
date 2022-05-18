import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { IonRadioGroup } from '@ionic/angular';
import { createSetFocusToInput } from '@sneat/components';
import { Gender } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

const animationTimings = '150ms';

const genders: { id: Gender, title: string }[] = [
	{ id: 'male', title: 'Male' },
	{ id: 'female', title: 'Female' },
	{ id: 'other', title: 'Other' },
	{ id: 'unknown', title: 'Unknown' },
	{ id: 'undisclosed', title: 'Undisclosed' },
];

@Component({
	selector: 'sneat-gender-form',
	templateUrl: './gender-form.component.html',
	animations: [
		trigger('radioOut', [
			transition(':leave', [
				animate(animationTimings,
					style({ height: 0 }),          // final style after the transition has finished
				),
			]),
		]),
		trigger('selectIn', [
			transition(':enter', [
				style({ display: 'none' }),           // initial styles
				animate(animationTimings,
					style({ display: 'block' }),          // final style after the transition has finished
				),
			]),
		]),
	],
})
export class GenderFormComponent {

	readonly genders = genders;

	@Input() gender?: Gender;
	@Output() genderChange = new EventEmitter<Gender>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}


	onChanged(): void {
		this.genderChange.emit(this.gender);
	}

	// TODO: Find a way to set focus to a radio group
	// private readonly setFocusToInput = createSetFocusToInput(this.errorLogger);
	// ngAfterViewInit(): void {
	// 	this.setFocusToInput(this.radioGroup, 100);
	// }
}
