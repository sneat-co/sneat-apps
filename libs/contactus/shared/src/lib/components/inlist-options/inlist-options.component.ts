import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

export interface IdEvent {
	uiEvent: Event;
	id: string;
}

interface Option {
	readonly id: string;
	readonly title?: string;
}

@Component({
	selector: 'sneat-inlist-options',
	templateUrl: './inlist-options.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class InlistOptionsComponent {
	@Input() public options?: Option[];
	@Output() public readonly optionSelected = new EventEmitter<IdEvent>();

	@Input() public selectedOption?: Option;

	protected onOptionSelected($event: Event, selected: Option): void {
		$event.stopPropagation();
		$event.preventDefault();
		this.selectedOption = selected;
		this.optionSelected.emit({ uiEvent: $event, id: selected.id });
	}
}
