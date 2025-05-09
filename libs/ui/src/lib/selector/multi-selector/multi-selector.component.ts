import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	ModalController,
} from '@ionic/angular/standalone';
import { ISelectItem, ISelectItemEvent } from '../selector-interfaces';
import { SelectorBaseComponent } from '../selector-base.component';

@Component({
	selector: 'sneat-multi-selector',
	templateUrl: './multi-selector.component.html',
	imports: [
		IonCard,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonItem,
		IonIcon,
		IonList,
	],
})
export class MultiSelectorComponent<T = ISelectItem>
	extends SelectorBaseComponent<T>
	implements OnChanges
{
	@Input() title = 'Select';

	@Input() canRemove = false;
	@Input() public allItems?: ISelectItem[];
	@Input() public selectedIDs?: readonly string[];

	@Output() readonly removeItems = new EventEmitter<ISelectItemEvent[]>();
	@Output() readonly addItems = new EventEmitter<ISelectItemEvent[]>();

	protected selectedItems?: ISelectItem[];

	constructor(modalController: ModalController) {
		super('MultiSelectorComponent', modalController);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['allItems']) {
			this.selectedItems = this.allItems?.filter((item) =>
				this.selectedIDs?.includes(item.id),
			);
		}
	}

	protected removeItem(event: Event, item: ISelectItem): void {
		event.stopPropagation();
		this.selectedItems = this.selectedItems?.filter((i) => i.id !== item.id);
		this.removeItems.emit([{ event, item }]);
	}
}
