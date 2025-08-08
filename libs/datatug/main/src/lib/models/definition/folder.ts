import { IProjItemBrief } from './project';

// IFolderItem holds brief information about a folder item like query, board, etc.
export interface IFolderItem {
	name: string;
}

// IFolderItem holds brief information about a folder item with an ID, like: query, board, etc.
export interface IFolderItemWithId extends IFolderItem {
	id: string;
}

// IFolder holds information about a folder with a brief summary of it children items
export interface IFolder extends IProjItemBrief {
	readonly boards?: Record<string, IFolderItem>;
	readonly queries?: Record<string, IFolderItem>;
	readonly numberOf?: Record<string, number>;
}

export function folderItemsAsList(
	items: Record<string, IFolderItem>,
): IFolderItemWithId[] {
	return Object.keys(items)
		.map((id) => ({ id, name: items[id].name }))
		.sort((a, b) => (a.name > b.name ? 1 : -1));
}
