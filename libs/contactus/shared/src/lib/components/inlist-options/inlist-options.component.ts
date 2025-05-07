import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';

export interface Option {
	readonly id: string;
	readonly title?: string;
}

export interface OptionEvent {
	readonly uiEvent: Event;
	readonly option: Option;
}

@Component({
	selector: 'sneat-inlist-options',
	templateUrl: './inlist-options.component.html',
	imports: [IonButtons, IonButton, IonSpinner, IonLabel, IonIcon],
})
export class InlistOptionsComponent {
	@Input() public options?: readonly Option[];
	@Output() public readonly optionSelected = new EventEmitter<OptionEvent>();

	@Input() public selectedOption?: Option;

	protected onOptionSelected($event: Event, selected: Option): void {
		$event.stopPropagation();
		$event.preventDefault();
		this.selectedOption = selected;
		this.optionSelected.emit({ uiEvent: $event, option: selected });
	}
}
