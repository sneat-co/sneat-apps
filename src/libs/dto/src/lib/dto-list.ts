import { IRecord, RxRecordKey } from '@sneat/rxstore';
import { IBriefWithIdAndTitle } from './dto-brief';
import { ITeamRecord, ITitledRecord, IWithRestrictions } from './dto-models';
import { IUserCommuneInfo } from './dto-user';
import { ListStatus, TeamType } from './types';

// import { CommuneShortId } from '../commune-ids';

export interface IQuantity {
	value: number;
	unit: string;
}

export interface IListItemCommon extends IRecord {
	subListId?: RxRecordKey;
	subListType?: ListType;
	title?: string; // Mandatory title
	quantity?: IQuantity;
	category?: string;
}

export interface IListItemInfo extends IListItemCommon {
	created?: string; // UTC datetime
	emoji?: string;
	done?: boolean;
	img?: string;
}

export interface ListCounts {  // TODO: Use some enumerator as IDB library does.
	active?: number;
	completed?: number;
}

export type ListType = 'buy' | 'cook' | 'do' | 'other' | 'recipe' | 'rsvp' | 'watch';

export interface IListCommon extends ITeamRecord, ITitledRecord {
	img?: string;
	emoji?: string;
	status?: ListStatus;
	done?: boolean;
	dtCreated?: number;
	dtClosed?: number;
	note?: string; // Is used for example for recipe text
}

export interface IListDto extends IListCommon, IWithRestrictions {
	type: ListType;
	numberOf?: ListCounts;
	items?: IListItemInfo[];
	commune?: IShortTeamInfo; // Used just for in-memory columns?
}

// tslint:disable-next-line:no-unnecessary-class
export class ListItemInfoModel {
	static trackBy: (index: number, item: IListItemInfo) => (string | number | undefined) = (index, item) =>
		!item ? index : !!item.id && `id:${item.id}` || item.subListId && `subList:${item.subListId}` || item.title;
}

// tslint:disable-next-line:no-unnecessary-class
export class ListItemModel {
	static equalListItems(...items: IListItemInfo[]): boolean {
		const { id, title, subListId, category, subListType } = items[0];
		return !items.some(item => {
			if (id) {
				return item.id !== id;
			}
			return !!title && item.title !== title
				|| !!subListId && item.subListId !== subListId
				|| !!category && item.category !== category
				|| !!subListType && item.subListType !== subListType;
		});
	}
}

export interface IListItemDto extends IListCommon, IListItemCommon {
	listId?: string;
	score?: number;
	subListItems?: IListItemInfo[];
}

export interface IShortTeamInfo {
	type: TeamType;
	id?: string;
	// shortId?: CommuneShortId;
	title?: string;
}


export function createShortCommuneInfoFromUserCommuneInfo(v: IUserCommuneInfo): IShortTeamInfo {
	return { id: v.id, title: v.title, /*shortId: v.shortId,*/ type: v.type };
}

export function getListShortUrlId(communeId: string, shortId?: string, id?: string): string | undefined {
	if (shortId) {
		return `${communeId}-${shortId}`;
	}
	if (id) {
		return id;
	}
	return undefined;
}

export interface IListInfo extends IWithRestrictions {
	parentListId?: string;
	parentListType?: ListType;
	type: ListType;
	id?: RxRecordKey;
	shortId?: string;
	title?: string;
	hidden?: boolean;
	team?: IShortTeamInfo;
	emoji?: string;
	img?: string;
	note?: string;
	itemsCount?: number;
}

export interface IListBrief extends IBriefWithIdAndTitle {
	emoji?: string;
}

export function isListInfoMatchesListDto(i: IListInfo, l: any): boolean {
	return !!i.id && i.id === l.dto.id
		|| (
			i.type === l.dto.type
			&& (
				!!i.shortId && i.shortId === l.shortId
			)
		);
}

export function createListInfoFromDto(dto: IListDto, shortId?: string): IListInfo {
	if (!dto.title) {
		throw new Error('!title');
	}
	const listInfo: IListInfo = {
		type: dto.type,
		title: dto.title,
	};
	if (shortId) {
		listInfo.shortId = shortId;
	}
	if (dto.id) {
		listInfo.id = dto.id;
	}
	if (dto.items && dto.items.length) {
		listInfo.itemsCount = dto.items.length;
	}
	if (dto.emoji) {
		listInfo.emoji = dto.emoji;
	}
	if (dto.restrictions) {
		listInfo.restrictions = dto.restrictions;
	}
	if (dto.commune) {
		listInfo.team = dto.commune;
	}
	return listInfo;
}

export interface IListGroup {
	id: string;
	title?: string;
	type?: ListType;
	emoji?: string;
	lists?: IListInfo[];
}

export interface IListGroupsHolder {
	listGroups?: IListGroup[];
}

export function createListItemInfoFromListInfo(listInfo: IListInfo): IListItemInfo {
	return {
		title: listInfo.title,
		subListType: listInfo.type,
		subListId: listInfo.id || `${listInfo.team && listInfo.team.id}-${listInfo.shortId}`,
		emoji: listInfo.emoji,
		img: listInfo.img,
	};
}

export function createListItemInfo(listItem: IListItemDto): IListItemInfo {
	const v: IListItemInfo = {
		id: listItem.id,
		title: listItem.title,
	};
	if (listItem.emoji) {
		v.emoji = listItem.emoji;
	}
	if (listItem.done) {
		v.done = true;
	}
	return v;
}
