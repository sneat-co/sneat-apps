import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'sneat-filter-item',
	templateUrl: './filter-item.component.html',
})
export class FilterItemComponent {

	@Input() public filter = '';

	@Output() changed = new EventEmitter<string>();
	@Output() readonly blured = new EventEmitter<Event>();

	clearFilter(): void {
		console.log('clearFilter()');
		this.filter = '';
		this.onChanged();
	}

	onChanged(): void {
		this.changed.emit(this.filter.trim());
	}
}
