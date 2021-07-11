import {IProjItemBrief} from './project';

export interface IFolderItem {
	name: string
}

export interface IFolder extends IProjItemBrief {
	readonly boards?: { [id: string]: IFolderItem };
	readonly queries?: { [id: string]: IFolderItem };
}
