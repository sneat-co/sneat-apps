import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule, IonItemSliding, ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core/dist/types/components/toast/toast-interface';
import { listItemAnimations } from '@sneat/core';
import { IListItemBrief } from '../../../dto';
import { IListContext } from '../../../contexts';
import { ISpaceContext } from '@sneat/team-models';
import { ListusComponentBaseParams } from '../../../listus-component-base-params';
import {
	IListItemIDsRequest,
	ISetListItemsIsComplete,
} from '../../../services';
import { ListService } from '../../../services';
import { ListDialogsService } from '../../dialogs/ListDialogs.service';
import { IListItemWithUiState } from '../list-item-with-ui-state';

@Component({
	selector: 'sneat-list-item',
	standalone: true,
	imports: [CommonModule, IonicModule],
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

	@Input({ required: true })
	public listItemWithUiState?: IListItemWithUiState;
	@Input() public space?: ISpaceContext; // TODO: remove?
	@Input() list?: IListContext;
	@Output()
	public readonly itemClicked = new EventEmitter<IListItemBrief>();
	@Output()
	public readonly itemChanged = new EventEmitter<{
		old: IListItemWithUiState;
		new: IListItemWithUiState;
	}>();
	@Output()
	public readonly listChanged = new EventEmitter<IListContext>();
	public isSettingIsDone = false;

	constructor(
		private readonly params: ListusComponentBaseParams,
		private readonly listDialogs: ListDialogsService,
		private readonly toastCtrl: ToastController,
	) {}

	public get listItem(): IListItemBrief | undefined {
		return this.listItemWithUiState?.brief;
	}

	private get listService(): ListService {
		return this.params.listService;
	}

	private get errorLogger() {
		return this.params.spaceParams.errorLogger;
	}

	protected isSpinning(): boolean {
		if (!this.listItemWithUiState) {
			return false;
		}
		const { state } = this.listItemWithUiState;
		return (
			!!state.isReordering || !!state.isDeleting || !!state.isChangingIsDone
		);
	}

	protected goListItem(): void {
		const listItem = this.listItem;
		console.log(
			`goListItem(${listItem?.id}), subListId=${listItem?.subListId}`,
		);
		this.itemClicked.emit(listItem);
	}

	protected isDone(item?: IListItemWithUiState): boolean {
		return !!item?.brief.isDone;
	}

	protected onIsDoneCheckboxChanged(event: Event): void {
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

	protected setIsDone(
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
		const newItem: IListItemWithUiState = {
			brief: { ...item.brief, isDone },
			state: { ...item.state, isChangingIsDone: true },
		};
		const performSetIsDone = (): void => {
			this.itemChanged.emit({
				old: item,
				new: newItem,
			});

			this.isSettingIsDone = true;
			if (!this.space || !this.list || !this.list.brief) {
				return;
			}
			const request: ISetListItemsIsComplete = {
				spaceID: this.space.id,
				listID: this.list.id,
				itemIDs: [item.brief.id],
				isDone: isDone,
			};
			this.listService.setListItemsIsCompleted(request).subscribe({
				next: () => {
					this.itemChanged.emit({
						old: newItem,
						new: {
							brief: newItem.brief,
							state: { ...newItem.state, isChangingIsDone: false },
						},
					});
					const toastOptions: ToastOptions = {
						message: isDone
							? `${item.brief.title} marked as completed`
							: `${item.brief.title} marked as active`,
						duration: 1000,
						color: 'light',
						buttons: [{ icon: 'close', role: 'cancel' }],
						keyboardClose: true,
					};
					this.toastCtrl
						.create(toastOptions)
						.then((toast) =>
							toast
								.present()
								.catch(
									this.errorLogger.logErrorHandler(
										'Failed to present a toast message about list item isCompleted set to ' +
											isDone,
									),
								),
						)
						.catch(
							this.errorLogger.logErrorHandler(
								'Failed to present a toast message about list item isCompleted set to ' +
									isDone,
							),
						);
				},
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

	protected deleteFromList(
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
		if (!this.space?.id) {
			return;
		}
		if (!this.list?.brief?.type) {
			return;
		}
		const request: IListItemIDsRequest = {
			spaceID: this.space?.id,
			listID: this.list?.id,
			// listType: this.list?.brief?.type,
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

	protected openCopyListItemDialog(
		listItem: IListItemBrief,
		event: Event,
	): void {
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
