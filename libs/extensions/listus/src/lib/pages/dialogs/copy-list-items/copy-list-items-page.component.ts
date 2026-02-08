import { Component, Input, OnInit, inject } from '@angular/core';
import {
	ModalController,
	ToastController,
	IonButton,
	IonCheckbox,
	IonCol,
	IonContent,
	IonFooter,
	IonGrid,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonRow,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { IListInfo, IListItemBrief, ListType } from '../../..';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ListService } from '../../../services/list.service';

@Component({
	selector: 'sneat-copy-list-items',
	templateUrl: './copy-list-items-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
		IonCheckbox,
		IonFooter,
		IonGrid,
		IonRow,
		IonCol,
		IonButton,
	],
})
export class CopyListItemsPageComponent implements OnInit {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly toastCrl = inject(ToastController);
	private readonly listService = inject(ListService);

	@Input() modal?: ModalController;
	@Input() from?: IListInfo;
	@Input() to?: IListInfo;
	@Input() listItems: IListItemBrief[] | undefined;

	private selectedListItemIds: string[] = [];

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

	cancel(): void {
		this.modal?.dismiss().catch(this.errorLogger.logError);
	}

	addSelected(): void {
		console.log('addSelected');
		// this.userService.currentUserLoaded.pipe(
		// 	first(),
		// 	mergeMap(
		// 		userDto => {
		// 			if (!userDto) {
		// 				throw new Error('!userDto');
		// 			}
		// 			if (!this.to?.team) {
		// 				throw new Error('!this.to.team');
		// 			}
		// 			if (!this.from?.team) {
		// 				throw new Error('!this.from.team');
		// 			}
		// 			if (!this.listItems) {
		// 				throw new Error('!this.listItems');
		// 			}
		// 			const toListId = this.to.id || `${this.to.team.id}-${this.to.shortId}`;
		// 			const listItemsToAdd = this.listItems.filter(
		// 				item => this.selectedListItemIds.some(id => id === item.id));
		// 			return this.listusService.copyListItems(this.from.id, toListId, listItemsToAdd, userDto);
		// 		},
		// 	),
		// 	ignoreElements(),
		// )
		// 	.subscribe(
		// 		{
		// 			complete: () => {
		// 				console.log('Selected items added to target list');
		// 				this.addSelectedCompleted()
		// 					.catch(this.errorLogger.logError);
		// 			},
		// 			error: this.errorLogger.logError,
		// 		},
		// 	);
	}

	onItemToggled(event: Event): void {
		const { checked, value } = (event as CustomEvent).detail as {
			checked: boolean;
			value: string;
		};
		console.log(`CopyListItemsPage.onItemToggled(${value}, ${checked})`);
		if (checked) {
			if (!this.selectedListItemIds.includes(value)) {
				this.selectedListItemIds.push(value);
			}
		} else {
			this.selectedListItemIds = this.selectedListItemIds.filter(
				(v) => v !== value,
			);
		}
	}

	private loadList(): void {
		console.log(`CopyListItemsPage.loadList(${this.from?.id})`);
		if (this.from?.id) {
			this.listService
				.getListById(
					{ id: 'TO_BE_IMPLEMENTED' },
					'TO_BE_IMPLEMENTED' as ListType,
					this.from.id,
				)
				.subscribe({
					next: (list) => {
						console.log('loaded list:', list);
						this.listItems = (list && list.dbo?.items) || [];
						this.setSelected();
					},
					error: this.errorLogger.logError,
				});
		}
	}

	private setSelected(): void {
		this.selectedListItemIds = this.listItems
			? this.listItems.map((item) => item.id as string)
			: [];
	}

	private async addSelectedCompleted(): Promise<void> {
		console.log('CopyListItemsPage.addSelectedCompleted()');
		const toast = await this.toastCrl.create({
			message: `${this.selectedListItemIds.length} items copied`,
		});
		toast.present().catch(this.errorLogger.logError);
		await this.modal?.dismiss();
	}
}
