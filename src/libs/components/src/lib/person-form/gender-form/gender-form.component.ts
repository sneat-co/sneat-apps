import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Gender } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

const animationTimings = '150ms';

type GenderOption = { id: Gender; title: string; icon: string; emoji?: string };

const gendersOptions: GenderOption[] = [
	{ id: 'male', title: 'Male', icon: 'man-outline', emoji: '👨' },
	{ id: 'female', title: 'Female', icon: 'woman-outline', emoji: '👩' },
	{ id: 'other', title: 'Other', icon: 'person-outline' },
	{ id: 'unknown', title: 'Unknown', icon: 'person-circle-outline' },
	{ id: 'undisclosed', title: 'Undisclosed', icon: 'person' },
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

	readonly genders = gendersOptions;

	@Input() genderID?: Gender;
	@Output() genderChange = new EventEmitter<Gender>();

	// @ViewChild(IonRadioGroup, { static: true }) radioGroup?: IonRadioGroup;

	gender?: GenderOption;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		// private readonly elemRef: ElementRef,
	) {
	}

	// ngAfterViewInit(): void {
	// 	const el = this.elemRef.nativeElement as Element;
	// 	setTimeout(() => {
	// 		const inputs = el.querySelectorAll('input');
	// 		if (inputs.length > 0) {
	// 			inputs[0].focus();
	// 		}
	// 		console.log('el', el, 'inputs', inputs);
	// 	}, 1000);
	// }



	onGenderChanged(): void {
		this.gender = this.genders.find(gender => gender.id === this.genderID);
		this.genderChange.emit(this.genderID);
	}

	// TODO: Find a way to set focus to a radio group
	// private readonly setFocusToInput = createSetFocusToInput(this.errorLogger);
	// ngAfterViewInit(): void {
	// 	this.setFocusToInput(this.radioGroup, 100);
	// }
}
