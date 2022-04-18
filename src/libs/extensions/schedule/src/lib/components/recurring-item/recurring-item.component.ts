import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISlotItem} from '../../view-models';

@Component({
	selector: 'sneat-recurring-item',
	templateUrl: './recurring-item.component.html',
})
export class RecurringItemComponent {

	@Input()
	public slot?: ISlotItem;

	@Output() onclick = new EventEmitter<ISlotItem>();

	// @Input()
	// public communeBasePage: CommuneBasePage;

	goActivity(): void {
		this.onclick.emit(this.slot);
	}
}
