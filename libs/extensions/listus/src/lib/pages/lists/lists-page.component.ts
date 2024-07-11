import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
	IonicModule,
	IonInput,
	IonItemSliding,
	PopoverController,
} from '@ionic/angular';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { APP_INFO, eq, IAppInfo } from '@sneat/core';
import { IListGroup, IListInfo, ListType } from '../../dto';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import { createShortTeamInfoFromDto } from '@sneat/team-models';
import { Subscription } from 'rxjs';
import { ListusComponentBaseParams } from '../../listus-component-base-params';
import {
	IListusAppStateService,
	ListusCoreServicesModule,
} from '../../services';
import { NewListDialogComponent } from './new-list-dialog.component';
import { NewListDialogModule } from './new-list-dialog.module';

@Component({
	selector: 'sneat-lists-page',
	templateUrl: './lists-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ListusCoreServicesModule,
		NewListDialogModule,
		ContactusServicesModule,
	],
	providers: [TeamComponentBaseParams, ListusComponentBaseParams],
})
export class ListsPageComponent extends TeamBaseComponent {
	@ViewChild('newListTitle', { static: false }) newListTitle?: IonInput;
	addingToGroup: ListType | undefined;
	listGroups?: IListGroup[];
	reordered?: boolean;
	listTitle = '';
	private userCommunesSubscriptions: Subscription[] = [];
	private collapsedGroups?: string[];

	constructor(
		route: ActivatedRoute,
		private readonly params: ListusComponentBaseParams,
		@Inject(APP_INFO) private readonly appService: IAppInfo,
		private readonly modalCtrl: PopoverController,
		// private readonly shelfService: ShelfService,
		// private preloaderService: NgModulePreloaderService,
		private readonly listusAppStateService: IListusAppStateService,
	) {
		super('ListsPageComponent', route, params.teamParams);
		// this.preloaderService.markAsPreloaded('lists');
		this.listusAppStateService.changed.subscribe((appState) => {
			this.collapsedGroups = appState.collapsedGroups;
		});
	}

	// defaultShortCommuneId: 'family';
	public get appId(): string {
		return this.appService.appId;
	}

	clearAddingToGroup(): void {
		this.addingToGroup = undefined;
	}

	public isCollapsed(group: IListGroup): boolean {
		return !!group.title && !!this.collapsedGroups?.includes(group.title);
	}

	public clickGroup(group: IListGroup): void {
		if (!group.title) {
			return;
		}
		this.listusAppStateService.setGroupCollapsed(
			group.title,
			!this.isCollapsed(group),
		);
	}

	reorder(event: Event, listGroup: IListGroup): void {
		console.log('reorder', event, listGroup);
		this.errorLogger.logError('reorder is not implemented yet');
		// let dtoListGroup: IListGroup | undefined;
		// let reordered = false;
		// if (!this.team) {
		// 	throw new Error('!this.commune');
		// }
		// this.teamService.createTeam().updateRecord(undefined, this.communeRealId, dto => {
		// 	if (!dto) {
		// 		if (!this.team?.dto) {
		// 			throw new Error('!this.commune.dto');
		// 		}
		// 		dto = this.team.dto;
		// 		dto.id = this.communeRealId;
		// 	} else if (!dto.listGroups ||
		// 		dto.listGroups.length !== this.listGroups.length ||
		// 		dto.listGroups.map(lg => lg.type)
		// 			.join(',') !== this.listGroups.map(lg => lg.type)
		// 			.join(',')
		// 	) {
		// 		return { dto, changed: false }; // TODO: document why, don't remember by now but this code smells and is a potential for silent bugs
		// 	}
		// 	// tslint:disable-next-line:no-non-null-assertion
		// 	dtoListGroup = dto.listGroups && dto.listGroups.find(lg => eq(lg.type, listGroup.type));
		// 	if (!dtoListGroup) {
		// 		throw new Error('!dtoListGroup');
		// 	}
		// 	// To avoid UI re-paint issue we reorder UI elements and then map change to DTO
		// 	listGroup.lists = event.detail.complete(listGroup.lists);
		// 	// tslint:disable-next-line:no-non-null-assertion
		// 	if (!dtoListGroup) {
		// 		throw new Error('!dtoListGroup');
		// 	}
		// 	// tslint:disable-next-line:no-non-null-assertion
		// 	dtoListGroup.lists = listGroup.lists!.map(
		// 		listInfo => {
		// 			if (!dtoListGroup) {
		// 				throw new Error('!dtoListGroup');
		// 			}
		// 			// tslint:disable-next-line:no-non-null-assertion
		// 			const list = dtoListGroup.lists!.find(l => !!l.id && l.id === listInfo.id || !!l.shortId && l.shortId === listInfo.shortId);
		// 			if (!list) {
		// 				throw new Error('!list');
		// 			}
		// 			return list;
		// 		});
		// 	this.reordered = reordered = true;
		// 	return { dto, changed: true };
		// })
		// 	.subscribe(
		// 		() => {
		// 			if (!reordered) {
		// 				event.detail.complete();
		// 				if (dtoListGroup) {
		// 					listGroup.lists = [...(dtoListGroup.lists || [])];
		// 				}
		// 			}
		// 		},
		// 		err => {
		// 			event.detail.complete();
		// 			this.errorLogger.logError(err, 'Failed to persist items reordering:');
		// 		});
	}

	public goList(list: IListInfo): void {
		console.log(
			`ListsPage.goList(id=${list.id}, shortId=${list.shortId}, title=${list.title}) => communeInfo:`,
			list.team,
		);
		const listGroup = this.listGroups?.find((lg) =>
			(lg.lists || []).some((l) => eq(l.id, list.id)),
		);
		if (!this.space) {
			throw new Error('!this.team');
		}
		const path = `list/${list.type}/${list.id}`;
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.space, path, {
				state: {
					listInfo: list,
					listGroupTitle: listGroup && listGroup.title,
					team: this.space,
				},
			})
			.catch(this.errorLogger.logErrorHandler('Failed to navigate to list'));
	}

	addTo(event: Event, listType?: ListType): void {
		event.preventDefault();
		event.stopPropagation();
		if (!listType) {
			this.errorLogger.logError('listType is a required parameter');
			return;
		}
		this.newList(listType, event).catch(this.errorLogger.logError);
	}

	// We need this method as user can be a member of multiple communes
	// As a minimum by default it is `personal` & `family`.
	// We display groups of lists from all user communes
	// Once a commune DTO loaded we should update combined listGroups[]
	// A good example would be a "to watch movies" group that will have family lists (visible to all family members)

	remove(
		listGroup: IListGroup,
		list: IListInfo,
		ionItemSliding: IonItemSliding,
	): void {
		ionItemSliding.close().catch((err) => {
			this.errorLogger.logError(err, 'Failed to close sliding item');
		});
		this.reordered = true;
		if (!list.id) {
			throw new Error('!list.id');
		}
		if (!this.space) {
			throw new Error('!this.team');
		}
		this.params.listService.deleteList(this.space, list.id).subscribe({
			next: () => {
				listGroup.lists =
					listGroup.lists?.filter((l) => !eq(l.id, list.id)) || [];
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to delete list');
			},
		});
	}

	cancelListCreation(): void {
		this.addingToGroup = undefined;
	}

	createList(listGroup: IListGroup): void {
		if (!listGroup.type) {
			throw new Error('!listGroup.type');
		}
		this.addingToGroup = undefined;
		const title = this.listTitle.trim();
		const listInfo: IListInfo = {
			id: title,
			type: listGroup.type,
			title,
			emoji: '📝',
			itemsCount: 0,
		};
		if (!listGroup.lists) {
			listGroup.lists = [];
		}
		listGroup.lists.push(listInfo);
		this.listTitle = '';
		this.goList(listInfo);
	}

	trackByGroupIndex = (index: number, group: IListGroup) => group.type;

	trackById(index: number, item: IListInfo): string | number {
		return (
			(item.id && `id:${item.id}`) ||
			(item.shortId &&
				item.team &&
				item.team.id &&
				`${item.team.id}:${item.type}:${item.shortId}`) ||
			(item.shortId && `${item.type}:${item.shortId}`) ||
			index
		);
	}

	// protected onCommuneIdsChanged(communeIds: ICommuneIds): void {
	// 	super.onCommuneIdsChanged(communeIds);
	// 	if (this.communeRealId && isUserPersonalCommune(this.communeRealId, this.authStateService.authState.currentUserId)) {
	// 		this.watchAllUserCommunes();
	// 	}
	// }

	protected override onTeamDtoChanged(): void {
		try {
			super.onTeamDtoChanged();
			if (this.space) {
				if (this.reordered) {
					this.reordered = false;
				} else {
					// if (!this.listGroups) {
					// 	this.listGroups = this.commune.dto.listGroups.map(lg => {
					// 		const listGroup: IListGroup = {
					// 			...lg,
					// 			lists: lg.lists && lg.lists.map(l => ({
					// 				...l,
					// 				commune: l.commune || this.shortCommuneInfo,
					// 			})),
					// 		};
					// 		return listGroup;
					// 	});
					// }
					this.updateListsFromTeam(undefined);
				}
			} else {
				this.listGroups = [];
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process onTeamDtoChanged');
		}
	}

	private unsubscribeFromUserCommunesSubscriptions(): void {
		if (
			this.userCommunesSubscriptions &&
			this.userCommunesSubscriptions.length
		) {
			this.userCommunesSubscriptions.forEach((s) => {
				s.unsubscribe();
			});
			this.userCommunesSubscriptions = [];
		}
	}

	// private watchAllUserCommunes(): void {
	// 	this.userService.currentUserLoaded.subscribe(userDto => {
	// 		this.unsubscribeFromUserCommunesSubscriptions();
	// 		if (!userDto) {
	// 			throw new Error('!userDto');
	// 		}
	// 		console.log('userDto.communes:', userDto.communes);
	// 		if (userDto.communes && userDto.communes.length) {
	// 			userDto.communes
	// 				.forEach(
	// 					communeInfo => {
	// 						if (communeInfo.id) {
	// 							this.userCommunesSubscriptions.push(this.communeService.watchById(communeInfo.id)
	// 								.subscribe({
	// 									next: communeDto => {
	// 										if (communeDto) {
	// 											this.updateListsFromCommune(communeDto, communeInfo.shortId);
	// 										}
	// 									},
	// 									error: err => {
	// 										this.errorLogger.logError(err, 'Failed to load user commune');
	// 									},
	// 								}));
	// 						}
	// 					},
	// 				);
	// 		}
	// 	});
	// }

	// and personal lists (private to the current user).
	private updateListsFromTeam(listGroups?: IListGroup[]): void {
		console.log(
			`ListsPageComponent.updateListsFromTeam()`,
			listGroups,
			'\n: passed:',
			undefined, // TODO(fix): team.dto?.listGroups && team.dto?.listGroups.map((lg) => ({ ...lg })),
			'\n: current:',
			this.listGroups &&
				this.listGroups.map((lg) => ({ ...lg, lists: [...(lg.lists || [])] })),
		);
		if (!listGroups) {
			if (this.space?.type === 'family') {
				listGroups = [
					{
						id: 'to-buy',
						type: 'to-buy',
						title: 'To buy',
						lists: [
							{
								id: 'groceries',
								type: 'to-buy',
								emoji: '🛒',
								title: 'Groceries',
							},
						],
					},
				];
			} else {
				return;
			}
		}
		if (!this.listGroups) {
			this.listGroups = [];
		}
		listGroups?.forEach((passedListGroup) => {
			if (!passedListGroup.type) {
				throw new Error(
					'!passedListGroup.type: ' + JSON.stringify(passedListGroup),
				);
			}
			let listGroup = this.listGroups?.find((v, i) => {
				if (!v.type) {
					throw new Error(`!this.listGroups[${i}]`);
				}
				return v.type === passedListGroup.type;
			});
			if (!listGroup) {
				listGroup = {
					...passedListGroup,
					lists: [],
				};
				this.listGroups?.push(listGroup);
			}
			(passedListGroup.lists || []).forEach((passedList, i) => {
				if (!passedList.type) {
					throw new Error(`!passedList[${i}]`);
				}
				if (!passedList.team && this.space.type === 'personal') {
					passedList = {
						...passedList,
						team: createShortTeamInfoFromDto(this.space),
					};
				}
				const matchedList = ((listGroup && listGroup.lists) || []).find(
					(currentList, listIndex) => {
						if (!currentList) {
							throw new Error(
								`listGroup.lists has null or undefined item at ${listIndex}`,
							);
						}
						const matchedListTypes = currentList.type === passedList.type;
						const matchedIds =
							!!currentList.id && currentList.id === passedList.id;
						const matchedShortId =
							!!currentList.shortId &&
							currentList.shortId === passedList.shortId;
						const matchedCommuneTypes =
							!!currentList.team &&
							!!passedList.team &&
							currentList.team.type === passedList.team.type;
						const matchedCommuneIds =
							!!currentList.team &&
							!!passedList.team &&
							currentList.team.id === passedList.team.type;
						const matchedCommuneShortIds =
							!!currentList.team &&
							!!passedList.team &&
							eq(currentList.team?.id, passedList.team.id);
						const matched =
							matchedIds ||
							(matchedShortId &&
								matchedListTypes &&
								matchedCommuneTypes &&
								(matchedCommuneIds || matchedCommuneShortIds));
						if (
							currentList.title === 'Groceries' &&
							passedList.title === 'Groceries'
						) {
							console.log(
								'passedList',
								passedList,
								'currentList',
								currentList,
								'matchedIds',
								matchedIds,
								'matchedListTypes',
								matchedListTypes,
								'matchedShortId',
								matchedShortId,
								'matchedCommuneTypes',
								matchedCommuneTypes,
								'matchedCommuneShortIds',
								matchedCommuneShortIds,
								'matched',
								matched,
							);
						}
						return matched;
					},
				);
				if (!matchedList) {
					if (!listGroup?.lists) {
						throw new Error('listGroup?.lists');
					}
					listGroup.lists.push({ ...passedList });
				} else {
					if (
						passedList.itemsCount !== undefined &&
						!eq(matchedList.itemsCount, passedList.itemsCount)
					) {
						// Update items count
						// This happens when we add an item to a list
						matchedList.itemsCount = passedList.itemsCount;
					}
					if (!matchedList.id) {
						// This happens when we materialized list to ListKind.
						// Before that most of the lists are live within CommuneDto
						matchedList.id = passedList.id;
					}
					if (!matchedList.team) {
						matchedList.team = createShortTeamInfoFromDto(this.space);
					}
				}
			});
		});
		console.log('this.listGroups:', this.listGroups);
	}

	private async newList(listType: ListType, event: Event): Promise<void> {
		const listGroup = this.listGroups?.find((lg) => lg.type === listType);
		if (!listGroup) {
			throw new Error('!listGroup');
		}
		const modalPromise = this.modalCtrl.create({
			component: NewListDialogComponent,
			componentProps: {
				title: `${listGroup.emoji} ${listGroup.title}`,
			},
			event,
		});
		try {
			const modal = await modalPromise;
			if (modal.componentProps) {
				modal.componentProps['modal'] = modal;
			}
			await modal.present();
			const { data } = await modal.onDidDismiss();
			if (data) {
				const listInfo = data as IListInfo;
				if (listGroup.lists) {
					listGroup.lists.push(listInfo);
				} else {
					listGroup.lists = [listInfo];
				}
			}
		} catch (err) {
			this.errorLogger.logError(err);
		}
	}
}
