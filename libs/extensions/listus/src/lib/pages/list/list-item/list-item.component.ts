//tslint:disable:no-unsafe-any
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { listItemAnimations } from '@sneat/core';
import { IListItemBrief } from '@sneat/dto';
import { IListContext, ITeamContext } from '@sneat/team-models';
import { ListusComponentBaseParams } from '../../../listus-component-base-params';
import {
	IListItemIDsRequest,
	ISetListItemsIsComplete,
} from '../../../services/interfaces';
import { ListService } from '../../../services/list.service';
import { ListDialogsService } from '../../dialogs/ListDialogs.service';
import { IListItemWithUiState } from '../list-item-with-ui-state';

@Component({
	selector: 'sneat-list-item',
	templateUrl: './list-item.component.html',
	styleUrls: ['./list-item.component.scss'],
	animations: [listItemAnimations],
})
export class ListItemComponent {
	@Input()
	public listItems?: IListItemWithUiState[];

	@Input()
	public showDoneCheckbox = false;

	@Input()
	public doneFilter: 'all' | 'active' | 'completed' = 'all';

	@Input()
	public listMode: 'reorder' | 'swipe' = 'reorder';

	@Input()
	public listItemWithUiState?: IListItemWithUiState;
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
	) {}

	public get listItem(): IListItemBrief | undefined {
		return this.listItemWithUiState?.brief;
	}

	private get listService(): ListService {
		return this.params.listService;
	}

	private get errorLogger() {
		return this.params.teamParams.errorLogger;
	}

	public isSpinning(): boolean {
		if (!this.listItemWithUiState) {
			return false;
		}
		const { state } = this.listItemWithUiState;
		return (
			!!state.isReordering || !!state.isDeleting || !!state.isChangingIsDone
		);
	}

	goListItem(item: IListItemBrief): void {
		console.log(`goListItem(${item.id}), subListId=${item.subListId}`, item);
		this.itemClicked.emit(item);
	}

	isDone(item?: IListItemWithUiState): boolean {
		return !!item?.brief.isDone;
	}

	onIsDoneCheckboxChanged(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		if (!this.listItemWithUiState) {
			return;
		}
		const { checked } = (event as CustomEvent).detail;
		if (checked === undefined) {
			return;
		}
		console.log('onIsDoneCheckboxChanged()', checked, this.doneFilter);
		const isDone = !!checked;
		this.setIsDone(this.listItemWithUiState, isDone);
	}

	// tslint:disable-next-line:prefer-function-over-method
	setIsDone(
		item?: IListItemWithUiState,
		isDone?: boolean,
		ionSliding?: IonItemSliding,
	): void {
		if (!item) {
			return;
		}
		if (isDone === undefined) {
			isDone = !this.isDone(item);
		}
		const performSetIsDone = (): void => {
			item.state.isChangingIsDone = true;
			this.isSettingIsDone = true;
			item.brief.isDone = isDone;
			if (!this.team || !this.list || !this.list.brief) {
				return;
			}
			const request: ISetListItemsIsComplete = {
				teamID: this.team.id,
				listID: this.list.id,
				listType: this.list.brief.type,
				itemIDs: [item.brief.id],
				isDone: !!isDone,
			};
			this.listService.setListItemsIsCompleted(request).subscribe({
				error: this.errorLogger.logErrorHandler(
					'failed to mark list item as completed',
				),
				complete: () => {
					this.isSettingIsDone = false;
				},
			});
		};
		if (ionSliding) {
			(ionSliding as IonItemSliding)
				.close()
				.then(performSetIsDone)
				.catch(this.errorLogger.logErrorHandler('Failed to set completed'));
		} else {
			performSetIsDone();
			// setTimeout(() => performSetIsDone(), 0);
		}
	}

	deleteFromList(
		item: IListItemBrief,
		ionSliding?: IonItemSliding | HTMLElement,
	): void {
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
		this.listService.deleteListItems(request).subscribe({
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
			.copyListItems([listItem], {
				type: listItem.subListType || 'other',
				id: listItem.subListId,
				title: listItem.title,
			})
			.catch(this.errorLogger.logError);
	}
}
