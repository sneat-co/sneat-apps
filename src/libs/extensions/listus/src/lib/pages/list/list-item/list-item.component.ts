//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { listItemAnimations } from '@sneat/core';
import { IListItemBrief, ListType } from '@sneat/dto';
import { IListContext, ITeamContext } from '@sneat/team/models';
import { ListusComponentBaseParams } from '../../../listus-component-base-params';
import { IListItemIDsRequest } from '../../../services/interfaces';
import { ListDialogsService } from '../../dialogs/ListDialogs.service';

@Component({
	selector: 'sneat-list-item',
	templateUrl: './list-item.component.html',
	styleUrls: ['./list-item.component.scss'],
	animations: [listItemAnimations],
})
export class ListItemComponent {

	@Input()
	public listItems?: IListItemBrief[];

	@Input()
	public listItem?: IListItemBrief;

	@Input() public team?: ITeamContext; // TODO: remove?

	@Input() list?: IListContext;
	@Input() listType?: ListType;

	@Output()
	public readonly itemClicked = new EventEmitter<IListItemBrief>();

	@Output()
	public readonly listChanged = new EventEmitter<IListContext>();

	constructor(
		private readonly params: ListusComponentBaseParams,
		private readonly listDialogs: ListDialogsService,
	) {
	}

	private get errorLogger() {
		return this.params.teamParams.errorLogger;
	}

	goListItem(item: IListItemBrief): void {
		console.log(`goListItem(${item.id}), subListId=${item.subListId}`, item);
		this.itemClicked.emit(item);
	}

	// tslint:disable-next-line:prefer-function-over-method
	setIsCompleted(item: IListItemBrief, ionSliding: IonItemSliding | HTMLElement, isCompleted: boolean): void {
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

	deleteFromList(item: IListItemBrief, ionSliding: IonItemSliding | HTMLElement): void {
		console.log('ListItemComponent.deleteFromList()', item);
		if (!item.id) {
			return;
		}
		if (!this.list?.id) {
			return;
		}
		if (!this.team?.id) {
			return;
		}
		if (!this.list?.brief?.type) {
			return;
		}
		const request: IListItemIDsRequest = {
			teamID: this.team?.id,
			listID: this.list?.id,
			listType: this.list?.brief?.type,
			itemIDs: [item.id],
		};
		this.params.listService.deleteListItem(request)
			.subscribe({
				next: () => {
					console.log('ListItemComponent => item deleted');
					// this.listChanged.emit(listDto);
				},
				error: this.errorLogger.logError,
				complete: () => {
					if (ionSliding) {
						(ionSliding as IonItemSliding)
							.closeOpened()
							.catch(this.errorLogger.logError);
					}
				},
			});
	}

	public openCopyListItemDialog(listItem: IListItemBrief, event: Event): void {
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
