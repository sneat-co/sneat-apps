import {Component, EventEmitter, Inject, Input, Output, ViewChild} from '@angular/core';
import {IonInput} from '@ionic/angular';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {Observable} from 'rxjs';
import {IRecord} from '@sneat/data';
import {IOptionallyTitled, IProjItemBrief, ProjectItemType} from '@sneat/datatug/models';

export interface ICardTab {
	id: string;
	title: string;
}

@Component({
	selector: 'sneat-card-list',
	templateUrl: './sneat-card-list.component.html',
})
export class SneatCardListComponent {

	@Input() isFilterable: boolean;
	@Input() projItemType: ProjectItemType;
	@Input() title: string;
	@Input() isLoading: boolean;
	@Input() items: IProjItemBrief[];
	@Input() create: (name: string) => Observable<IRecord<IOptionallyTitled>>;
	@Input() itemIcon: string;
	@Input() tab: string;
	@Input() tabs: ICardTab[];
	@Input() noItemsText: string;
	@Input() getRouterLink: (item: IProjItemBrief) => string;

	@Output() cardTitleClick = new EventEmitter<void>();
	@Output() itemClick = new EventEmitter<IProjItemBrief>();
	@Output() tabChanged = new EventEmitter<string>();

	@ViewChild(IonInput, {static: false}) addInput: IonInput;

	public mode: 'list' | 'add' = 'list';
	public name = '';
	public isAdding: boolean;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	click(event: Event, item: IProjItemBrief): void {
		event.preventDefault();
		event.stopPropagation();
		this.itemClick.emit(item);
	}

	public showAddForm(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.mode = 'add';
		setTimeout(() => {
			console.log(this.addInput);
			this.addInput
        // @ts-ignore TS2339: Property 'setFocus' does not exist on type 'IonInput'.
        .setFocus()
        .catch(err => this.errorLogger.logError(err, 'Failed to set focus'));
		}, 200);
	}

	tryCreate(): void {
		this.isAdding = true;
		this.create(this.name.trim()).subscribe({
			next: item => {
				this.items.push(item);
				this.isAdding = false;
				this.mode = 'list';
				this.name = '';
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to create ' + this.projItemType);
				this.isAdding = false;
			},
		});
	}
}
