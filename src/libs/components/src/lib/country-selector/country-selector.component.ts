import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
})
export class CountrySelectorComponent {

	@Input() label: string = 'Country';
	@Input() country?: string;
	@Output() changed = new EventEmitter<string>();

	// tslint:disable-next-line:prefer-function-over-method
	onChanged(event: Event): void {
		console.log('event:', event);
		// this.changed.emit(s);
	}
}
