import { IWithCreatedShort } from './dto-with-modified';

export interface ITeamModuleDocRef {
	readonly teamID: string;
	readonly moduleID: string;
	readonly collection: string;
	readonly itemID: string;
}

export interface IRelationship {
	created: IWithCreatedShort;
}

export type IRelationships = Readonly<Record<string, IRelationship>>;

export interface IRelatedItem {
	readonly relatedAs?: IRelationships; // if related contact is a child of the current contact, then relatedAs = {"child": ...}
	readonly relatesAs?: IRelationships; // if related contact is a child of the current contact, then relatesAs = {"parent": ...}
}

export type IRelatedItemsByID = Readonly<Record<string, IRelatedItem>>;

export type IRelatedItemsByCollection = Readonly<
	Record<string, IRelatedItemsByID>
>;

export type IRelatedItemsByModule = Readonly<
	Record<string, IRelatedItemsByCollection>
>;

export type IRelatedItemsByTeam = Readonly<
	Record<string, IRelatedItemsByModule>
>;

export interface IWithRelatedOnly {
	readonly related?: IRelatedItemsByTeam;
}

export interface IWithRelatedAndRelatedIDs extends IWithRelatedOnly {
	readonly relatedIDs?: readonly string[];
}
