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
	readonly boards?: { [id: string]: IFolderItem };
	readonly queries?: { [id: string]: IFolderItem };
	readonly numberOf?: { [id: string]: number };
}

export function folderItemsAsList(items: {
	[id: string]: IFolderItem;
}): IFolderItemWithId[] {
	return Object.keys(items)
		.map((id) => ({ id, name: items[id].name }))
		.sort((a, b) => (a.name > b.name ? 1 : -1));
}
