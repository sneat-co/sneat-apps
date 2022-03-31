import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SlotItem} from '../../view-models';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';

@Component({
	selector: 'app-activity-item',
	templateUrl: './activity-item.component.html',
})
export class ActivityItemComponent {

	@Input()
	public slot: SlotItem;
	@Output() onclick = new EventEmitter<SlotItem>();

	@Input()
	public communeBasePage: CommuneBasePage;

	goActivity(): void {
		this.onclick.emit(this.slot);
	}
}
