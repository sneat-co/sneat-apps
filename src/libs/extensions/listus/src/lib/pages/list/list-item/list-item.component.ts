//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { listItemAnimations } from '@sneat/core';
import { IListItemBrief } from '@sneat/dto';
import { IListContext, ITeamContext } from '@sneat/team/models';
import { ListusComponentBaseParams } from '../../../listus-component-base-params';
import { IListItemIDsRequest, ISetListItemsIsComplete } from '../../../services/interfaces';
import { ListService } from '../../../services/list.service';
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
	public showDoneCheckbox = false;

	@Input()
	public doneFilter: 'all' | 'active' | 'completed' = 'all';

	@Input()
	public listItem?: IListItemBrief;

	@Input() public team?: ITeamContext; // TODO: remove?

	@Input() list?: IListContext;

	@Output()
	public readonly itemClicked = new EventEmitter<IListItemBrief>();

	@Output()
	public readonly listChanged = new EventEmitter<IListContext>();

	public isSettingIsDone = false;

	constructor(
		private readonly params: ListusComponentBaseParams,
		private readonly listDialogs: ListDialogsService,
	) {
	}

	private get listService(): ListService {
		return this.params.listService;
	}

	private get errorLogger() {
		return this.params.teamParams.errorLogger;
	}

	goListItem(item: IListItemBrief): void {
		console.log(`goListItem(${item.id}), subListId=${item.subListId}`, item);
		this.itemClicked.emit(item);
	}

	isDone(item: IListItemBrief): boolean {
		return !!item.isDone || this.isSettingIsDone;
	}

	onIsDoneCheckboxChanged(event: Event): void {
		if (!this.listItem) {
			return;
		}
		const {checked} = (event as CustomEvent).detail;
		console.log('onIsDoneChanged()', checked, this.doneFilter);
		const isDone = !!checked;
		// switch (this.doneFilter) {
		// 	case 'active': isDone = checked; break;
		// 	case 'completed': isDone = !checked; break;
		// 	default:
		// 		return;
		// }
		this.setIsDone(this.listItem, undefined, isDone);
	}

	// tslint:disable-next-line:prefer-function-over-method
	setIsDone(item: IListItemBrief, ionSliding?: IonItemSliding | HTMLElement, isDone?: boolean): void {
		if (isDone === undefined) {
			isDone = !this.isDone(item);
		}
		const performSetIsDone = (): void => {
			this.isSettingIsDone = true;
			item.isDone = isDone;
			if (!this.team || !this.list || !this.list.brief) {
				return;
			}
			const request: ISetListItemsIsComplete = {
				teamID: this.team.id,
				listID: this.list.id,
				listType: this.list.brief.type,
				itemIDs: [item.id],
				isDone: !!isDone,
			};
			this.listService.setListItemsIsCompleted(request).subscribe({
				error: this.errorLogger.logErrorHandler('failed to mark list item as completed'),
				complete: () => {
					this.isSettingIsDone = false;
				},
			});
		};
		if (ionSliding) {
			(ionSliding as IonItemSliding).close()
				.then(performSetIsDone)
				.catch(this.errorLogger.logErrorHandler('Failed to set completed'));
		} else {
			performSetIsDone();
		}
	}

	deleteFromList(item: IListItemBrief, ionSliding?: IonItemSliding | HTMLElement): void {
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
		this.listService.deleteListItem(request)
			.subscribe({
				next: () => {
					console.log('ListItemComponent => item deleted');
					// this.listChanged.emit(listDto);
				},
				error: this.errorLogger.logError,
				complete: () => {
					if (ionSliding) {
						(ionSliding as IonItemSliding)
							?.closeOpened()
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
