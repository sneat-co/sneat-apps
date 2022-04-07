//tslint:disable:no-unsafe-any
import {Injectable} from '@angular/core';
import {IRxReadwriteTransaction, RxRecordUpdater, RxRecordKey, RxMutationLogger, mutation} from 'rxstore';
import {
	IList,
	IListItemsCommandParams,
	IListItemResult,
	IListItemService,
	IListService,
	IListusService,
	ReorderListItemsWorker, shortCommuneAndListIds,
} from './interfaces';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {CommuneKind, ListItemKind, ListKind, MovieKind, UserKind} from '../../../models/kinds';
import {ignoreElements, map, mapTo, mergeMap, tap} from 'rxjs/operators';
import {
	createListInfoFromDto,
	IListDto,
	IListGroup,
	IListItemDto,
	IListItemInfo,
	isListInfoMatchesListDto,
	ListItemModel
} from '../../../models/dto/dto-list';
import {IUserCommuneInfo, IUserDto, UserModel} from '../../../models/dto/dto-user';
import {eq, ICommuneService} from '../../../services/interfaces';
import {CommuneType} from '../../../models/types';
import {CommuneModel, ICommuneDto} from '../../../models/dto/dto-commune';
import {Commune} from '../../../models/ui/ui-models';
import {detectEmoji} from '../../../models/emojis';
import {IMovieDto} from '../../../models/dto/dto-movie';
import {IMovie} from '../../../models/movie-models';
import {ISneatReadwriteTx, SneatAppSchema} from '../../../models/db-schemas-by-app/sneat-app-schema';
import {IListusReadwriteTx, IListusStoreProvider, ListusKind} from '../../../models/db-schemas-by-app/listus-app-schema';
import {IMovieService} from '../watchlist/interfaces';

function getKinds(commune: Commune, item?: IListItemDto, affectsCommune: boolean = true): ListusKind[] {
	const kinds: ListusKind[] = affectsCommune ? [ListKind, CommuneKind] : [ListKind];
	if (item && item.id) {
		kinds.push(ListItemKind);
	}
	if (!commune.id) {
		kinds.push(UserKind);
	}
	return kinds;
}

export function generateNewId(items?: { id?: RxRecordKey }[]): string {
	const randomId = () => Math.random()
		.toString()
		// tslint:disable-next-line:no-magic-numbers
		.slice(2);
	let id = randomId();
	if (!items) {
		return id;
	}
	while (items.some(item => item.id === id)) {
		id = randomId();
	}
	return id;
}

@Injectable()
export class ListusDbService extends IListusService {

	constructor(
		private readonly listService: IListService,
		private readonly listItemService: IListItemService,
		private readonly communeService: ICommuneService,
		private readonly movieService: IMovieService,
		private readonly mutationLogger: RxMutationLogger,
		rxStoreProvider: IListusStoreProvider,
	) {
		super(rxStoreProvider);
	}


	private static addItemInfoToListDto(listDto: IListDto, item: IListItemInfo, communeDto: ICommuneDto): IListItemResult {
		let {items} = listDto;
		if (!item.id) {
			item.id = generateNewId(items);
		}
		const existingItem = items && items.find(v => !v.id && eq(v.title, item.title));
		if (existingItem) {
			return {listDto, success: false, message: `Duplicate item: ${item.title}`};
		}
		if (!items) {
			items = [];
			listDto = {
				...listDto,
				items,
			};
		}
		items.push(item);
		const changed = ListusDbService.updateListICommuneDto(listDto, communeDto);
		return {success: true, listDto, changed};
	}

	private static updateListICommuneDto(listDto: IListDto, communeDto: ICommuneDto): boolean {
		let changed = false;
		if (!listDto.communeId) {
			listDto.communeId = communeDto.id;
			changed = true;
		} else if (listDto.communeId !== communeDto.id) {
			throw new Error('listDto.communeId !== communeDto.id');
		}
		if (listDto.commune) {
			listDto.commune = undefined;
			changed = true;
		}
		return changed;
	}

	private static deleteItemInfoFromListDto(listDto: IListDto, item: IListItemInfo, communeDto: ICommuneDto)
		: { dto: IListDto; changed: boolean } {
		const itemsToDelete = listDto.items
			&& listDto.items.filter(v => ListItemModel.equalListItems(v, item))
			|| [];

		console.log('ListusService.deleteItemInfoFromListDto() => itemsToDelete:', itemsToDelete);

		let changed = itemsToDelete.length > 0;
		if (changed) {
			itemsToDelete.forEach(itemToDelete =>
				// tslint:disable-next-line:no-non-null-assertion
				listDto.items!.splice(listDto.items!.indexOf(itemToDelete), 1));
		}
		changed = ListusDbService.updateListICommuneDto(listDto, communeDto) || changed;
		return {dto: listDto, changed};
	}

	public reorderListItems(params: IListItemsCommandParams, reorderItems: ReorderListItemsWorker): Observable<IListDto> {
		const {commune, list} = params;
		console.log(`ListusService.reorderListItems(shortListId=${list.shortId}`);
		return this.readwriteTx(getKinds(commune, undefined, false), tx => {
			console.log('ListusService.reorderListItems() => tx');
			return this.updateListDto(tx, list, commune.dto, dto => {
				if (!dto.items || !list.dto.items || dto.items.length !== list.dto.items.length) {
					throw new Error('List changed, please try again');
				}
				reorderItems(dto);
				return {dto, changed: true};
			});
		});
	}

	// tslint:disable-next-line:prefer-function-over-method
	public isWatched(movie: IMovie, userId: string): boolean {
		if (!movie.watchedByUserIds) {
			movie.watchedByUserIds = [];
		}
		return movie.watchedByUserIds.includes(userId);
	}

	public setIsWatched(movie: IMovie, userId: string, isWatched: boolean): Observable<IMovieDto> {
		if (!userId) {
			return throwError('userId id required');
		}
		return this.readwriteTx([MovieKind, ListKind, CommuneKind], tx => {
			const o = !movie.id ? of(undefined) : this.movieService.getById(movie.id, tx);
			return o.pipe(
				mergeMap(movieDto => {
					if (!movieDto) {
						// tslint:disable-next-line:no-object-literal-type-assertion
						movieDto = {...movie} as IMovieDto;
					}
					if (!movieDto.watchedByUserIds) {
						movieDto.watchedByUserIds = [];
					}
					const indexUserForSet = movieDto.watchedByUserIds.indexOf(userId);
					if (isWatched) {
						if (indexUserForSet < 0) {
							movieDto.watchedByUserIds.push(userId);
						}
					} else {
						if (indexUserForSet >= 0) {
							movieDto.watchedByUserIds.splice(indexUserForSet, 1);
						}
					}
					if (movieDto.id) {
						return this.movieService.put(movieDto, tx);
					}
					return this.movieService.add(movieDto, tx);
				}),
				mergeMap(movieDto => {
					if (!movieDto.listIds || !movieDto.listIds.length) {
						return of(movieDto);
					}
					return forkJoin(
						movieDto.listIds.map(listId =>
							this.listService.getById(listId, tx) // TODO: update movie info in list DTO.
						),
					)
						.pipe(
							mapTo(movieDto),
						);
				})
			);
		});
	}

	public deleteListItem(params: IListItemsCommandParams): Observable<IListDto> {
		const {commune, list, items} = params;
		if (!items) {
			return throwError('Missing required parameter item');
		}
		if (!list) {
			return throwError('Missing required parameter list');
		}
		if (!list.dto) {
			return throwError(`Missing required list.dto, shortId=${list.shortId}`);
		}
		console.log(`ListusService.deleteListItem(list{shortId: ${list.shortId}, id: ${list.dto.id}, item=${items[0].id || items[0].title})`);
		return this.readwriteTx(getKinds(commune, items[0]), tx => {
			console.log('ListusService.deleteListItem() => tx');
			const {id} = items[0];
			if (!id) {
				throw new Error('!id');
			}
			return forkJoin([
				this.communeObserver(tx, commune)
					.pipe(
						tap((v) => {
							console.log('commune:', v);
						}),
					),
				// tslint:disable-next-line:no-non-null-assertion
				this.deleteListItemRecord(tx, id)
					.pipe(
						tap((v) => {
							console.log('item:', v);
						}),
					),
			])
				.pipe(
					tap(v => {
						console.log('input:', v);
					}),
					map(v => v[0]),
					tap(v => {
						console.log('communeDto:', v);
					}),
					mergeMap(communeDto => this.updateListDto(
						tx,
						{dto: list.dto, shortId: list.shortId}, communeDto,
						listDto => ListusDbService.deleteItemInfoFromListDto(listDto, items[0], communeDto),
						),
					),
					tap(v => {
						console.log('result:', v);
					}),
					mergeMap(v => {
						const deleteListItemMutation = mutation<{ list: string; item: string }>('delete-list-item');
						if (!list.dto.id) {
							throw new Error('!list.dto.id');
						}
						const m = deleteListItemMutation({list: list.dto.id, item: id});
						const $v: Observable<IListDto> = this.mutationLogger.recordMutation(tx, m)
							.pipe(
								mapTo(v),
							);
						return $v;
					}),
				);
		});
	}

	public addListItem(params: IListItemsCommandParams): Observable<IListItemResult> {
		const {commune, list, items} = params;
		console.log('ListusService.addListItem()', params);
		const emoji = detectEmoji(items[0].title);
		if (emoji) {
			items[0].emoji = emoji;
		}

		return this.communeService.communeReadwriteTx(
			commune,
			[ListItemKind, ListItemKind, CommuneKind],
			(tx, communeDto) => {
				console.log('addListItem() => communeDto:', communeDto);
				let listItemResult: IListItemResult;
				return this.updateListDto(
					tx,
					list,
					communeDto,
					listDto => {
						listItemResult = ListusDbService.addItemInfoToListDto(listDto, items[0], communeDto);
						return {dto: listItemResult.listDto, changed: listItemResult.success};
					})
					.pipe(
						// tslint:disable-next-line:ban-ts-ignore
						// @ts-ignore
						mapTo(listItemResult),
					);
			},
		);
	}

	private deleteListItemRecord(tx: IListusReadwriteTx, id: RxRecordKey): Observable<IListItemDto | undefined> {
		return id ? this.listItemService.deleteRecord(tx, id) : of(undefined);
	}

	private updateListDto(tx: ISneatReadwriteTx, list: IList, communeDto: ICommuneDto, worker: RxRecordUpdater<IListDto>)
		: Observable<IListDto> {
		if (!list) {
			throw new Error('ListusService.updateListDto(): list parameter is missing');
		}
		if (!list.dto) {
			throw new Error(`ListusService.updateListDto(): list.dto is missing, shortId=${list.shortId}`);
		}
		console.log(`ListusService.updateListDto(list{shortId:${list.shortId}, id:${list.dto && list.dto.id})`);

		const afterListRecordProcessed = mergeMap((dto2: IListDto) =>
			this.updateCommuneCounter(tx, {...list, dto: dto2}, communeDto));

		if (list.dto.id) {
			return this.listService.updateRecord(tx, list.dto.id, worker)
				.pipe(afterListRecordProcessed);
		}
		const {dto, changed} = worker(list.dto);
		if (changed) {
			return this.listService.add(dto, tx)
				.pipe(afterListRecordProcessed);
		}
		return of(list.dto);
	}

	private updateCommuneCounter(tx: IRxReadwriteTransaction<SneatAppSchema>, list: IList, communeDto: ICommuneDto): Observable<IListDto> {
		console.log(`ListusService.updateCommuneCounter(list.shortId=${list.shortId}, list.dto.id=${list.dto.id})`);
		const listDto = list.dto;
		if (listDto.communeId && communeDto.id && listDto.communeId !== communeDto.id) {
			throw new Error('An attempt to update counter in wrong commune');
		}
		let changed = false;
		const listGroup = communeDto.listGroups && communeDto.listGroups.find(lg => lg.type === listDto.type);
		let listInfo = listGroup && listGroup.lists && listGroup.lists.find(l => eq(l.id, listDto.id));
		if (!listInfo) {
			listInfo = listGroup && listGroup.lists && listGroup.lists.find(l => isListInfoMatchesListDto(l, list));
			if (listInfo) {
				listInfo.id = listDto.id;
				delete listInfo.commune;
				changed = true;
			} else {
				const m = 'list info not found in commune records';
				console.error(m, '\n\tlistDto:', listDto, '\n\tcommune listGroup:', listGroup);
				throw new Error(m);
			}
		}
		const itemsCount = listDto.items && listDto.items.length || 0;
		changed = changed || listInfo.itemsCount !== itemsCount;
		if (changed) {
			listInfo.itemsCount = itemsCount;
			return this.communeService.put(communeDto, tx)
				.pipe(mapTo(listDto));
		}
		return of(listDto);
	}

	private communeObserver(tx: ISneatReadwriteTx, commune: Commune): Observable<ICommuneDto> {
		return commune.id
			? this.communeService.mustGetById(commune.id, tx)
			: commune.shortId
				? this.communeService.materializeVirtualCommune(tx, commune.dto, commune.shortId)
					.pipe(map(v => v.communeDto))
				: throwError('!commune.id && !commune.shortID');
	}

	public copyListItems(fromListId: string, toListId: string, listItems: IListItemInfo[], userDto: IUserDto): Observable<void> {
		// TODO: simplify - create commune & list outside!
		console.log(`ListusService.copyListItems(${fromListId}, ${toListId}):`, listItems);
		// if (!fromListId) {
		//     return throwError('No fromListId provided');
		// }
		if (!toListId) {
			return throwError('No toListId provided');
		}
		if (!userDto) {
			return throwError('No userDto provided');
		}
		if (!listItems || !listItems.length) {
			return throwError('No listItems provided');
		}
		const kinds: ListusKind[] = [CommuneKind, ListKind, ListItemKind];

		let needToCreateCommune = false;
		// let needToCreateList = false;

		const {shortCommuneId, shortListId} = shortCommuneAndListIds(toListId);
		let communeInfo: IUserCommuneInfo | undefined;
		if (shortCommuneId && shortListId) {
			communeInfo = userDto.communes ? UserModel.getCommuneInfoById(shortCommuneId, userDto.communes) : undefined;
			if (!communeInfo || !communeInfo.id) {
				needToCreateCommune = true;
				// needToCreateList = true;
				kinds.push(UserKind);
			}
		}

		const userId = userDto.id;
		if (!userId) {
			throw new Error('!userId');
		}
		return this.readwriteTx(
			kinds,
			(tx: IListusReadwriteTx) => {
				const commune$ = needToCreateCommune || !communeInfo
					? this.communeService.createStandardCommune(tx, shortCommuneId as CommuneType, userId)
					: this.communeService.mustGetById(communeInfo.id || '', tx)
						.pipe(map(commune => ({commune, user: userDto})));
				return commune$.pipe(
					mergeMap(({commune}) => {
						if (!commune) {
							throw new Error('!commune');
						}
						let result: Observable<{ commune: ICommuneDto; toList: IListDto }>;
						if (shortListId) {
							const listInfo = CommuneModel.getListInfoByShortId(commune, shortListId);
							if (listInfo) {
								// tslint:disable-next-line:no-non-null-assertion
								const listId = listInfo.id;
								if (!listId) {
									throw new Error('!listId');
								}
								result = this.listService.mustGetById(listId, tx)
									.pipe(map(listDto => ({commune, toList: listDto})));
							} else if (shortListId === 'buy') {
								const listDto: IListDto = {
									type: 'buy',
									title: 'Groceries',
									commune: {id: commune.id, type: commune.type, title: commune.title},
								};
								result = of({commune, toList: listDto});
							} else {
								result = throwError('Not implemented copy of items for shortListId other then "buy"');
							}
						} else {
							result = throwError('Not implemented copy of items for communes without short ID');
						}
						return result;
					}),
					mergeMap(
						({commune, toList}) => {
							if (!toList) {
								throw new Error(`Target list not found by id: ${toListId}`);
							}
							if (!toList.items) {
								toList.items = [];
							}
							toList.items.push(...listItems
								.filter(item => !!toList.items && !toList.items.some(existing => eq(existing.id, item.id)))
								.map(item => ({...item})),
							);
							console.log('ready to save target list:', toList);
							const $saveList = toList.id ? this.listService.put(toList, tx) : this.listService.add(toList, tx);
							return $saveList.pipe(
								mergeMap(toList2 => {
									if (!commune.listGroups) {
										commune.listGroups = [];
									}
									const lgType = 'buy'; // TODO: get rid of hardcoded
									let lg: IListGroup | undefined = commune.listGroups.find(lg2 => lg2.type === 'buy');
									if (!lg) {
										lg = {type: lgType, lists: [], title: undefined};
										commune.listGroups.push(lg);
									}
									if (!lg.lists) {
										lg.lists = [];
									}
									lg.lists.push(createListInfoFromDto(toList2, shortListId));
									return this.communeService.put(commune);
								}),
							);
						}
					),
				);
			},
		)
			.pipe(ignoreElements());
	}
}
