import {Component, Input, OnInit} from '@angular/core';
import {IListInfo, IListItemInfo} from '../../../../../models/dto/dto-list';
import {ModalController, ToastController} from '@ionic/angular';
import {IErrorLogger, IUserService} from '../../../../../services/interfaces';
import {IListService, IListusService} from '../../../services/interfaces';
import {first, ignoreElements, mergeMap} from 'rxjs/operators';

@Component({
	selector: 'app-copy-list-items',
	templateUrl: './copy-list-items-page.component.html',
})
export class CopyListItemsPageComponent implements OnInit {

	@Input() modal: ModalController;
	@Input() from: IListInfo;
	@Input() to: IListInfo;
	@Input() listItems: IListItemInfo[] | undefined;

	private selectedListItemIds: string[];

	constructor(
		private readonly toastCrl: ToastController,
		private readonly errorLogger: IErrorLogger,
		private readonly listService: IListService,
		private readonly listusService: IListusService,
		private readonly userService: IUserService,
	) {
	}

	ngOnInit(): void {
		if (!this.listItems) {
			this.loadList();
		} else {
			console.log('from:', this.from);
			console.log('to:', this.to);
			console.log('listItems:', this.listItems);
			this.setSelected();
		}
	}

	private loadList(): void {
		console.log(`CopyListItemsPage.loadList(${this.from.id})`);
		if (this.from.id) {
			this.listService.getById(this.from.id)
				.subscribe(list => {
					console.log('loaded list:', list);
					this.listItems = list && list.items;
					this.setSelected();
				});
		}
	}

	private setSelected(): void {
		this.selectedListItemIds = this.listItems
			? this.listItems.map(item => item.id as string)
			: [];
	}

	cancel(): void {
		this.modal.dismiss()
			.catch(err => {
				this.errorLogger.logError(err);
			});
	}

	addSelected(): void {
		console.log('addSelected');
		this.userService.currentUserLoaded.pipe(
			first(),
			mergeMap(
				userDto => {
					if (!userDto) {
						throw new Error('!userDto');
					}
					if (!this.to.commune) {
						throw new Error('!this.to.commune');
					}
					if (!this.from.id) {
						throw new Error('!this.from.id');
					}
					if (!this.listItems) {
						throw new Error('!this.listItems');
					}
					const toListId = this.to.id || `${this.to.commune.id}-${this.to.shortId}`;
					const listItemsToAdd = this.listItems.filter(
						item => this.selectedListItemIds.some(id => id === item.id));
					return this.listusService.copyListItems(this.from.id, toListId, listItemsToAdd, userDto);
				},
			),
			ignoreElements(),
		)
			.subscribe(
				{
					complete: () => {
						console.log('Selected items added to target list');
						this.addSelectedCompleted()
							.catch(this.errorLogger.logError);
					},
					error: this.errorLogger.logError,
				},
			);
	}

	onItemToggled({checked, value}: { checked: boolean; value: string }): void {
		console.log(`CopyListItemsPage.onItemToggled(${value}, ${checked})`);
		if (checked) {
			if (this.selectedListItemIds.indexOf(value) < 0) {
				this.selectedListItemIds.push(value);
			}
		} else {
			this.selectedListItemIds = this.selectedListItemIds.filter(v => v !== value);
		}
	}

	private async addSelectedCompleted(): Promise<void> {
		console.log('CopyListItemsPage.addSelectedCompleted()');
		const toast = await this.toastCrl.create({
			message: `${this.selectedListItemIds.length} items copied`,
		});
		toast.present()
			.catch(this.errorLogger.logError);
		await this.modal.dismiss();
	}
}
