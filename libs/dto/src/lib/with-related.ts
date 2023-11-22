import { IWithCreatedOn } from './dto-with-modified';

export interface IRelationship extends IWithCreatedOn {}

export type IRelationships = Readonly<{
	[relationshipID: string]: IRelationship;
}>;

export interface IRelatedItem {
	readonly relatedAs?: IRelationships; // if related contact is a child of the current contact, then relatedAs = {"child": ...}
	readonly relatesAs?: IRelationships; // if related contact is a child of the current contact, then relatesAs = {"parent": ...}
}

export type IRelatedItemsByID = Readonly<{
	[itemID: string]: IRelatedItem;
}>;

export type IRelatedItemsByCollection = Readonly<{
	[collectionID: string]: IRelatedItemsByID;
}>;

export type IRelatedItemsByModule = Readonly<{
	[moduleID: string]: IRelatedItemsByCollection;
}>;

export type IRelatedItemsByTeam = Readonly<{
	[teamID: string]: IRelatedItemsByModule;
}>;

export interface IWithRelatedOnly {
	readonly related?: IRelatedItemsByTeam;
}

export interface IWithRelatedAndRelatedIDs extends IWithRelatedOnly {
	readonly relatedIDs?: readonly string[];
}
