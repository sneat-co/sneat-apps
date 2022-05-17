import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gender } from '@sneat/dto';

const animationTimings = '150ms';

const genders: {id: Gender, title: string}[] = [
	{id: 'male', title: 'Male'},
	{id: 'female', title: 'Female'},
	{id: 'other', title: 'Other'},
	{id: 'unknown', title: 'Unknown'},
	{id: 'undisclosed', title: 'Undisclosed'},
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

	onChanged(): void {
		this.genderChange.emit(this.gender);
	}
}
