import {
	Component,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
	IRecord,
	IRetroItem,
	IRetroList,
	IRetroListItem,
	IUser,
	RetrospectiveStage,
} from '../../../models/interfaces';
import { ErrorLogger, IErrorLogger } from '@sneat-team/ui-core';
import { UserService } from '../../../services/user-service';
import {
	IAddRetroItemRequest,
	RetroItemType,
	RetroItemTypeEnum,
	RetrospectiveService,
} from '../../retrospective.service';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-my-retro-items',
	templateUrl: './my-retro-items.component.html',
})
export class MyRetroItemsComponent implements OnInit, OnDestroy, OnChanges {
	@ViewChild(IonInput, { static: false }) titleInput; // TODO: IonInput;

	@Input() isEditable = true;
	@Input() noExpandCollapse: boolean;
	@Input() tabAutoSelect;
	@Input() teamId: string;
	@Input() title = 'My feedback for next retrospective';

	public typeControl = new FormControl('', [Validators.required]);

	public titleControl = new FormControl('', [
		// Validators.required,
	]);

	public addRetroItemForm = new FormGroup({
		titleControl: this.titleControl,
	});

	public adding = false;

	public retroLists?: IRetroList[] = [
		{ id: RetroItemTypeEnum.good, title: '👍 Good' },
		{ id: RetroItemTypeEnum.bad, title: '👎 Bad' },
		{ id: RetroItemTypeEnum.endorsement, title: '🥇 Kudos' },
		{ id: RetroItemTypeEnum.idea, title: '💡 Ideas' },
	];

	private userSubscription: Subscription;

	constructor(
		private readonly retrospectiveService: RetrospectiveService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly userService: UserService
	) {}

	public get currentType(): string {
		return this.typeControl.value as string;
	}

	public get currentItems(): IRetroItem[] | undefined {
		return this.retroLists && this.items(this.currentType);
	}

	public trackById = (_, item: { id: string }) => item.id;

	public trackByID = (i: number, item: IRetroItem) => item.ID;

	public ngOnInit(): void {
		this.userSubscription = this.userService.userRecord
			.pipe(filter((user) => !!user))
			.subscribe((user) => this.processUserRecord(user));
	}

	public ngOnDestroy(): void {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.tabAutoSelect && this.tabAutoSelect) {
			if (!this.typeControl.value) {
				this.typeControl.setValue('good');
			}
		}
	}

	public typeChanged(): void {
		setTimeout(() => {
			this.titleInput
				.setFocus()
				.catch((err) =>
					this.errorLogger.logError(
						err,
						'Failed to set focus to title input (ScrumRetroCardComponent.typeChanged)'
					)
				);
		}, 50);
		// if (!this.retroSub) {
		// 	this.retroSub = this.retrospectiveService.watchRetro(this.teamId)
		// 		.subscribe({
		// 			next: retro => {
		// 				this.retro = retro;
		// 				this.itemsByType = retro && retro.itemsByType;
		// 			},
		// 			error: err => this.errorLoggerService.logError(err, 'Failed to get retrospective draft'),
		// 		});
		// }
	}

	public items(type: string): IRetroListItem[] {
		return this.retroLists.find((rl) => rl.id === type)?.items || [];
	}

	public listColor(id: RetroItemType): string {
		switch (id) {
			case RetroItemTypeEnum.good:
				return 'success';
			case RetroItemTypeEnum.bad:
				return 'danger';
			case RetroItemTypeEnum.endorsement:
				return 'primary';
			case RetroItemTypeEnum.idea:
				return 'tertiary';
		}
	}

	public delete(item: IRetroListItem): void {
		item.isDeleting = true;
		const type = this.typeControl.value as RetroItemType;
		this.retrospectiveService
			.deleteRetroItem({
				type,
				team: this.teamId,
				meeting: RetrospectiveStage.upcoming,
				item: item.ID,
			})
			.subscribe({
				next: () => {
					const list = this.retroLists.find((l) => l.id === type);
					list.items = list.items.filter((v) => v.ID !== item.ID);
				},
				error: (err) => {
					item.isDeleting = false;
					this.errorLogger.logError(err, 'Failed to delete scrum item');
				},
			});
	}

	public titleBlur(event?: Event): void {
		if ((this.titleControl.value as string).trim()) {
			this.add(event);
		}
	}

	public add(event?: Event): void {
		event?.stopPropagation();
		try {
			const type = this.typeControl.value as RetroItemType;
			console.log('add()', type);
			const title = (this.titleControl.value as string).trim();
			this.titleControl.setValue(title);
			if (!title || !this.titleControl.valid) {
				return;
			}
			const request: IAddRetroItemRequest = {
				team: this.teamId,
				meeting: RetrospectiveStage.upcoming,
				type,
				title,
			};
			if (!this.retroLists) {
				this.retroLists = [];
			}
			const retroList = this.retroLists.find((l) => l.id === type);
			if (!retroList) {
				this.errorLogger.logError(
					`list not found by id "${type}", have: ${this.retroLists
						.map((l) => l.id)
						.join(', ')}`
				);
				return;
			}
			const items = retroList.items || [];
			if (!retroList.items) {
				retroList.items = items;
			}
			// eslint-disable-next-line @typescript-eslint/naming-convention
			items.push({ ID: '', title });
			this.titleControl.setValue('');
			this.retrospectiveService.addRetroItem(request).subscribe(
				(response) => {
					console.log(response);

					// const item: IRetroItem = {id: response.id, title: request.title};
					// const items = this.itemsByType[type];
					// if (items) {
					// 	items.push(item);
					// } else {
					// 	this.itemsByType[type] = [item]
					// }
				},
				(err) => {
					this.retroLists[type] = this.retroLists[type].filter(
						(item) => item.Id || item.title !== title
					);
					this.errorLogger.logError(
						err,
						'Failed to add a private retrospective item'
					);
				}
			);
			this.titleControl.markAsPristine();
			this.titleControl.markAsUntouched();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to add retro item');
		}
	}

	private processUserRecord(user: IRecord<IUser>): void {
		try {
			const teamInfo = user?.data?.teams?.[this.teamId];
			console.log(
				`user.data.teams[${this.teamId}].retroItems:`,
				teamInfo?.retroItems
			);
			if (!teamInfo) {
				return; // TODO: Log error & redirect to /teams
			}
			if (teamInfo.retroItems) {
				Object.entries(teamInfo.retroItems).forEach(([itemType, items]) => {
					const retroList = this.retroLists.find((rl) => rl.id === itemType);
					if (retroList) {
						if (items && items.length) {
							retroList.items = items;
						} else {
							delete retroList.items;
						}
					} else {
						this.retroLists.push({ id: itemType, title: itemType, items });
					}
				});
			} else {
				this.retroLists.forEach((retroList) => delete retroList.items);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process user record');
		}
	}
}
