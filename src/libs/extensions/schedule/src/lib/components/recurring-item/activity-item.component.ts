import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SlotItem} from '../../view-models';

@Component({
	selector: 'sneat-activity-item',
	templateUrl: './activity-item.component.html',
})
export class ActivityItemComponent {

	@Input()
	public slot?: SlotItem;

	@Output() onclick = new EventEmitter<SlotItem>();

	// @Input()
	// public communeBasePage: CommuneBasePage;

	goActivity(): void {
		this.onclick.emit(this.slot);
	}
}
