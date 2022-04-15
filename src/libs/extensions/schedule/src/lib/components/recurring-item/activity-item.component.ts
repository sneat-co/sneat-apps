import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ISlotItem} from '../../view-models';

@Component({
	selector: 'sneat-activity-item',
	templateUrl: './activity-item.component.html',
})
export class ActivityItemComponent {

	@Input()
	public slot?: ISlotItem;

	@Output() onclick = new EventEmitter<ISlotItem>();

	// @Input()
	// public communeBasePage: CommuneBasePage;

	goActivity(): void {
		this.onclick.emit(this.slot);
	}
}
