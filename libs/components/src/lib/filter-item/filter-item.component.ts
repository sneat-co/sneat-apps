import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	input,
	Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'sneat-filter-item',
	templateUrl: './filter-item.component.html',
	imports: [IonicModule, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterItemComponent {
	public readonly $filter = input.required<string>();

	@Output() readonly changed = new EventEmitter<string>();
	@Output() readonly blured = new EventEmitter<Event>();

	protected clearFilter(event: Event): void {
		console.log('clearFilter()');
		event.stopPropagation();
		event.preventDefault();
		this.emitChanged('');
	}

	protected onFilterChanged(event: CustomEvent): void {
		// console.log(`FilterItemComponent.onFilterChanged()`, event);
		this.emitChanged(event.detail.value || '');
	}

	protected onBlured(event: Event): void {
		console.log(`FilterItemComponent.onBlured()`, event);
		this.blured.emit(event);
	}

	private emitChanged(value: string): void {
		// console.log(`FilterItemComponent.emitChange(value=${value})`);
		this.changed.emit(value);
	}
}
