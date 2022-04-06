//tslint:disable:no-unsafe-any
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IListDto, IListItemInfo, IShortCommuneInfo, ListType} from '../../../../../models/dto/dto-list';
import {IonItemSliding} from '@ionic/angular';
import {IErrorLogger} from '../../../../../services/interfaces';
import {Commune} from '../../../../../models/ui/ui-models';
import {ListDialogsService} from '../../dialogs/ListDialogs.service';
import {IListItemCommandParams, IListusService} from '../../../services/interfaces';
import {listItemAnimations} from '../../../../../animations/list-animations';

@Component({
	selector: 'sneat-list-item',
	templateUrl: './list-item.component.html',
	styleUrls: ['./list-item.component.scss'],
	animations: [listItemAnimations],
})
export class ListItemComponent {

	constructor(
		protected readonly errorLogger: IErrorLogger,
		private readonly listDialogs: ListDialogsService,
		private readonly listusService: IListusService,
	) {
	}

	@Input()
	public listItems: IListItemInfo[];

	@Input()
	public listItem: IListItemInfo;

	// public communeShortId: string; // TODO: remove

	@Input() public commune: Commune; // TODO: remove

	public shortCommuneInfo: IShortCommuneInfo;

	@Input() listType: ListType;

	@Input() public shortListId: string; // TODO: remove
	@Input() public listDto: IListDto; // TODO: remove?

	@Output()
	public readonly itemClicked = new EventEmitter<IListItemInfo>();

	@Output()
	public readonly listChanged = new EventEmitter<IListDto>();

	goListItem(item: IListItemInfo): void {
		console.log(`goListItem(${item.id}), subListId=${item.subListId}`, item);
		this.itemClicked.emit(item);
	}

	// tslint:disable-next-line:prefer-function-over-method
	setIsCompleted(item: IListItemInfo, ionSliding: IonItemSliding | HTMLElement, isCompleted: boolean): void {
		(ionSliding as IonItemSliding).close()
			.then(
				() => {
					item.done = isCompleted;
				},
				err => {
					this.errorLogger.logError(err, 'Failed to set completed');
				},
			);
	}

	deleteFromList(item: IListItemInfo, ionSliding: IonItemSliding | HTMLElement): void {
		console.log('ListItemComponent.deleteFromList()', item);
		this.listusService.deleteListItem(this.createListItemCommandParams(item))
			.subscribe({
				next: listDto => {
					console.log('ListItemComponent => item deleted');
					this.listChanged.emit(listDto);
				},
				error: this.errorLogger.logError,
				complete: () => {
					if (ionSliding) {
						(ionSliding as IonItemSliding).closeOpened()
							.catch(this.errorLogger.logError);
					}
				}
			});
	}

	private createListItemCommandParams(item: IListItemInfo): IListItemCommandParams {
		return {
			commune: this.commune,
			list: {dto: this.listDto, shortId: this.shortListId},
			items: [item],
		};
	} // TODO delete on list.page

	public openCopyListItemDialog(listItem: IListItemInfo, event: Event): void {
		console.log(`openCopyListItemDialog()`, listItem);
		event.stopPropagation();

		this.listDialogs
			.copyListItems(
				[listItem],
				{
					type: listItem.subListType || 'other',
					id: listItem.subListId,
					title: listItem.title,
				})
			.catch(this.errorLogger.logError);
	}
}
