import { Inject, Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Injectable()
export class ListItemService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly sneatApiService: SneatApiService,
	) {}

	// public txRemoveKinds(): string[] {
	//     return [ListItemKind, ListKind, CommuneKind];
	// }

	// public addCommuneItem(dto: IListItemDto, tx: ISneatReadwriteTx): Observable<IListItemDto> {
	// 	console.log('ListItemService.addCommuneItem', dto);
	// 	return this.addCommuneItemBase(tx, dto, undefined, (dto2, communeDto, tx2) => {
	// 		console.log('ListItemService.addCommuneItem => communeUpdater');
	// 		const {listId} = dto2;
	// 		if (!listId) {
	// 			throw new Error('List item required to have listId');
	// 		}
	// 		if (communeDto.listGroups) {
	// 			communeDto.listGroups.some(group => !!group.lists && group.lists.some(list => {
	// 				if (list.id === listId) {
	// 					list.itemsCount = (list.itemsCount || 0) + 1;
	// 					return true;
	// 				}
	// 				return false;
	// 			}));
	// 		}
	// 		return [
	// 			communeDto,
	// 			tx2.mustGetById<IListDto>(ListKind, listId)
	// 				.pipe(
	// 					mergeMap(listDto => {
	// 						if (!listDto.numberOf) {
	// 							listDto.numberOf = {};
	// 						}
	// 						switch (dto2.status) {
	// 							case 'active':
	// 								const active: number = listDto.numberOf && listDto.numberOf.active || 0;
	// 								listDto.numberOf.active = active + 1;
	// 								if (!listDto.items) {
	// 									listDto.items = [];
	// 								}
	// 								listDto.items.push(createListItemInfo(dto2));
	// 								break;
	// 							case 'archived': // TODO: nothing?
	// 								break;
	// 							default:
	// 								break;
	// 						}
	// 						if (dto2.done) {
	// 							const completed: number = listDto.numberOf.completed || 0;
	// 							listDto.numberOf.completed = completed + 1;
	// 						}
	// 						return tx2.put<IListDto>(ListKind, listDto);
	// 					}),
	// 					ignoreElements(),
	// 					defaultIfEmpty([ListItemKind, dto2] as [string, IRecord]),
	// 				),
	// 		];
	// 	});
	// }

	// public selectByListId(tx: ISneatReadonlyTx, listId: string, status?: ListStatus): Observable<SelectResult<IListItemDto>> {
	// 	return this.select(tx, ListItemKind, ['listId', 'status'], [listId, status || 'active']);
	// }
}
