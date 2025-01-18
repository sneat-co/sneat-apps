import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectItem, ISelectItemEvent } from '../selector-interfaces';
import { SelectorBaseComponent } from '../selector-base.component';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-multi-selector',
	templateUrl: './multi-selector.component.html',
	standalone: false,
})
export class MultiSelectorComponent
	extends SelectorBaseComponent
	implements OnChanges
{
	@Input() title = 'Select';

	@Input() canRemove = false;
	@Input() public allItems?: ISelectItem[];
	@Input() public selectedIDs?: readonly string[];

	@Output() readonly removeItems = new EventEmitter<ISelectItemEvent[]>();
	@Output() readonly addItems = new EventEmitter<ISelectItemEvent[]>();

	protected selectedItems?: ISelectItem[];

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(errorLogger, modalController);
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
