import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
	inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonIcon,
	IonInput,
	IonItem,
	ToastController,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { RandomIdService } from '@sneat/random';
import { ISpaceContext } from '@sneat/space-models';
import { IListContext } from '../../../contexts';
import {
	detectEmoji,
	ICreateListItemRequest,
	ListService,
} from '../../../services';
import { IListItemWithUiState } from '../list-item-with-ui-state';

@Component({
	selector: 'sneat-new-list-item',
	imports: [FormsModule, IonItem, IonIcon, IonInput, IonButton],
	templateUrl: './new-list-item.component.html',
})
export class NewListItemComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly randomService = inject(RandomIdService);
	private readonly toastCtrl = inject(ToastController);
	private readonly listService = inject(ListService);

	isFocused = false;

	public isAdding = false;

	@Input() isDone = false;
	@Input() disabled = false;
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) list?: IListContext;

	@ViewChild('newItemInput', { static: false }) newItemInput?: IonInput;

	@Output() readonly adding = new EventEmitter<IListItemWithUiState>();
	@Output() readonly added = new EventEmitter<IListItemWithUiState>();
	@Output() readonly failedToAdd = new EventEmitter<string>();

	public title = '';

	protected focused(): void {
		console.log('focused');
		this.isFocused = true;
	}

	protected add(): void {
		console.log('add()');
		if (!this.title.trim()) {
			return;
		}
		let id = '';
		for (let i = 0; i < 100; i++) {
			id = this.randomService.newRandomId({ len: 3 });
			if (!this.list?.dbo?.items?.some((item) => item.id === id)) {
				break;
			}
		}
		let item: ICreateListItemRequest = {
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

	protected clear(): void {
		console.log('NewListItem.clear()');
		this.title = '';
	}

	// Is intentionally public to be called from wrapping component.
	public focus(): void {
		console.log('NewListItem.focus()');
		if (!this.newItemInput) {
			this.errorLogger.logError('!this.newItemInput');
			return;
		}
		this.newItemInput.setFocus().catch(this.errorLogger.logError);
	}

	protected createListItem(listItemBrief: ICreateListItemRequest): void {
		console.log(
			'ListPage.createListItem',
			listItemBrief,
			this.list,
			this.space,
		);
		if (!listItemBrief) {
			throw new Error('movie is a required parameter');
		}
		if (!this.space) {
			throw new Error('no team context');
		}
		this.isAdding = true;
		if (!this.list) {
			throw new Error('no list context');
		}
		this.title = '';
		this.adding.emit({ brief: listItemBrief, state: { isAdding: true } });
		this.listService
			.createListItems({
				space: this.space,
				list: this.list,
				items: [listItemBrief],
			})
			.subscribe({
				next: (result) => {
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
					this.added.emit({ brief: listItemBrief, state: {} });
					setTimeout(() => {
						this.focus();
					}, 100);
				},
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to add item to list');
					this.isAdding = false;
					this.failedToAdd.emit(listItemBrief.id);
					this.focus();
				},
			});
	}

	protected showToast(opts: {
		message: string;
		duration?: number;
		color?: string;
	}): void {
		const worker = async () => {
			const toast = await this.toastCtrl.create({
				...opts,
				duration: opts.duration || 2000,
				buttons: [{ role: 'cancel', text: 'OK' }],
			});
			await toast.present();
		};
		worker().catch((err) => {
			this.errorLogger.logError(err, 'Failed to display toast');
		});
	}
}
