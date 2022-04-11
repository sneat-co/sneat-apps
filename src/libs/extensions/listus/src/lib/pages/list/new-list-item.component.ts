import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { IonInput, ToastController } from '@ionic/angular';
import { IListItemBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { RandomIdService } from '@sneat/random';
import { IListContext, ITeamContext } from '@sneat/team/models';
import { detectEmoji } from '../../services/emojis';
import { ListService } from '../../services/list.service';
import { IListItemWithUiState } from './list-item-with-ui-state';

@Component({
	selector: 'sneat-new-list-item',
	template: `
		<form (ngSubmit)="add()">
			<ion-item>
				<!--suppress AngularUndefinedBinding -->
				<ion-input [disabled]="disabled" #newItemInput autofocus="true" [(ngModel)]="title" name="title"
									 placeholder="New item"
									 (ionFocus)="focused()"
				></ion-input>
				<ion-button
					[color]="isFocused && title.trim() ? 'primary' : 'medium'"
					[disabled]="disabled" [fill]="title.trim() ? 'solid' : 'outline'" size="small" (click)="add()" slot="end"
				>
					Add
				</ion-button>
			</ion-item>
		</form>
	`,
})
export class NewListItemComponent {
	isFocused = false;

	public isAdding = false;

	@Input() isDone = false;
	@Input() disabled = false;
	@Input() team?: ITeamContext;
	@Input() list?: IListContext;

	@ViewChild('newItemInput', { static: false }) newItemInput?: IonInput;

	@Output() readonly adding = new EventEmitter<IListItemWithUiState>();
	@Output() readonly added = new EventEmitter<IListItemWithUiState>();
	@Output() readonly failedToAdd = new EventEmitter<string>();

	public title = '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly randomService: RandomIdService,
		private readonly toastCtrl: ToastController,
		private readonly listService: ListService,
	) {
	}


	focused(): void {
		console.log('focused');
		this.isFocused = true;
	}

	add(): void {
		console.log('add()');
		if (!this.title.trim()) {
			return;
		}
		let id = '';
		for (let i = 0; i < 100; i++) {
			id = this.randomService.newRandomId({ len: 3 });
			if (!this.list?.dto?.items?.some(item => item.id === id)) {
				break;
			}
		}
		let item: IListItemBrief = {
			id,
			title: this.title,
		};
		const emoji = detectEmoji(item.title);
		if (emoji) {
			item = { ...item, emoji };
		}
		if (this.isDone) {
			item = { ...item, isDone: true };
		}

		this.createListItem(item);
	}

	clear(): void {
		console.log('NewListItem.clear()');
		this.title = '';
	}

	focus(): void {
		console.log('NewListItem.focus()');
		if (!this.newItemInput) {
			this.errorLogger.logError('!this.newItemInput');
			return;
		}
		this.newItemInput.setFocus()
			.catch(this.errorLogger.logError);
	}

	createListItem(listItemBrief: IListItemBrief): void {
		console.log('ListPage.createListItem', listItemBrief, this.list, this.team);
		if (!listItemBrief) {
			throw new Error('movie is a required parameter');
		}
		if (!this.team) {
			throw new Error('no team context');
		}
		this.isAdding = true;
		if (!this.list) {
			throw new Error('no list context');
		}
		this.title = '';
		this.adding.emit({brief: listItemBrief, state: {isAdding: true}});
		this.listService.createListItems({
			team: this.team,
			list: this.list,
			items: [listItemBrief],
		})
			.subscribe({
				next: result => {
					console.log('ListPage.addListItem() => result:', result);
					if (result.success) {
						this.clear();
						this.focus();
					} else if (result.message) {
						this.showToast({ color: 'danger', message: result.message });
					}

					// if (!this.communeRealId && result.communeDto) {
					// 	this.setPageCommuneIds(
					// 		'addMovieToWatchlist',
					// 		{
					// 			short: this.communeShortId,
					// 			real: result.communeDto.id,
					// 		},
					// 		result.communeDto,
					// 	);
					// }
					this.isAdding = false;
					this.added.emit({brief: listItemBrief, state: {}});
					setTimeout(
						() => {
							this.focus();
						},
						// tslint:disable-next-line:no-magic-numbers
						100);
				},
				error: err => {
					this.errorLogger.logError(err, 'Failed to add item to list');
					this.isAdding = false;
					this.failedToAdd.emit(listItemBrief.id);
					this.focus();
				},
			});
	}

	protected showToast(opts: { message: string; duration?: number; color?: string }): void {
		const worker = async () => {
			const toast = await this.toastCtrl.create({
				...opts,
				// tslint:disable-next-line:no-magic-numbers
				duration: opts.duration || 2000,
				buttons: [{ role: 'cancel', text: 'OK' }],
			});
			await toast.present();
		};
		worker()
			.catch(err => {
					this.errorLogger.logError(err, 'Failed to display toast');
				},
			);
	}

}
