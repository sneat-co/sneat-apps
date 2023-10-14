import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'sneat-filter-item',
	templateUrl: './filter-item.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, FormsModule, RouterModule],
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
