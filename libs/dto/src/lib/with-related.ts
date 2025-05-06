import { IWithCreatedShort } from './dto-with-modified';

export interface IRelatedItemKey {
	readonly itemID: string;
	readonly spaceID?: string;
}

export interface ISpaceModuleItemRef {
	readonly module: string;
	readonly collection: string;
	readonly spaceID: string;
	readonly itemID: string;
}

export interface IRelationshipRole {
	readonly created: IWithCreatedShort;
}

export type WritableRelationshipRoles = Record<string, IRelationshipRole>;
// {
// 	// -readonly [K in keyof IRelationshipRoles]: IRelationshipRoles[K];
// };
export type IRelationshipRoles = Readonly<WritableRelationshipRoles>;

export interface IRelatedItem {
	// readonly keys: readonly IRelatedItemKey[];
	readonly rolesOfItem?: IRelationshipRoles; // if related item is a child of the current record, then rolesOfItem = {"child": ...}
	readonly rolesToItem?: IRelationshipRoles; // if related item is a child of the current contact, then rolesToItem = {"parent": ...}
}

export type IRelatedItems = Readonly<Record<string, IRelatedItem>>;
export type IRelatedCollections = Readonly<Record<string, IRelatedItems>>;
export type IRelatedModules = Readonly<Record<string, IRelatedCollections>>;

export interface IRelatedTo extends IWithRelatedOnly {
	readonly key: ISpaceModuleItemRef;
	readonly title: string; // pass empty string if you don't want to display name
}

export function getRelatedItems(
	moduleId: string,
	collectionId: string,
	related?: IRelatedModules,
): IRelatedItems {
	return (related && related[moduleId]?.[collectionId]) || {};
}

export interface IWithRelatedOnly {
	readonly related?: IRelatedModules;
}

export function validateRelated(related?: IRelatedModules): void {
	if (!related) {
		return;
	}
	Object.entries(related).forEach(([module, collections]) => {
		Object.entries(collections).forEach(([collection, items]) => {
			if (!items) {
				return;
			}
			Object.entries(items).forEach(([itemID, item]) => {
				if (!itemID) {
					throw new Error('ItemID is not set');
				}
			});
		});
	});
}

export interface IWithRelatedAndRelatedIDs extends IWithRelatedOnly {
	readonly relatedIDs?: readonly string[];
}

export const addRelatedItem = (
	related: IRelatedModules | undefined,
	key: ISpaceModuleItemRef,
	rolesOfItem?: IRelationshipRoles,
) => {
	related = related || {};
	let collectionRelated = related[key.module] || {};
	let relatedItems = collectionRelated[key.collection] || {};
	if (!hasRelated(related, key)) {
		relatedItems = {
			...relatedItems,
			[key.itemID]: { rolesOfItem },
		};
		collectionRelated = {
			...collectionRelated,
			[key.collection]: relatedItems,
		};
		related = { ...related, [key.module]: collectionRelated };
	}
	return related;
};

export const removeRelatedItem = (
	related: IRelatedModules | undefined,
	key: ISpaceModuleItemRef,
) => {
	if (!related) {
		return related;
	}
	let collectionRelated = related[key.module];
	if (!collectionRelated) {
		return related;
	}
	const relatedItems = collectionRelated[key.collection];
	if (!relatedItems) {
		return related;
	}
	if (hasRelated(related, key)) {
		const collectionItems = { ...relatedItems };
		delete collectionItems[key.itemID];
		collectionRelated = {
			...collectionRelated,
			[key.collection]: collectionItems,
		};
		related = { ...related, [key.module]: collectionRelated };
	}
	return related;
};

export const getRelatedItemByKey = (
	related: IRelatedModules | undefined,
	key: ISpaceModuleItemRef,
): IRelatedItem | undefined => {
	const items = related?.[key.module]?.[key.collection];
	const { itemID, spaceID } = key;
	return items?.[itemID] || items?.[`${itemID}@${spaceID}`];
};

export const getRelatedItemIDs = (
	related: IRelatedModules | undefined,
	module: string,
	collection: string,
	spaceID?: string,
): readonly string[] => {
	if (!related) {
		return [];
	}
	console.log('getRelatedItemIDs', module, collection, spaceID, related);
	const collectionRelated = (related || {})[module] || {};
	const relatedItems = collectionRelated[collection];
	const keys = Object.keys(relatedItems);
	return spaceID ? keys.filter((k) => k.endsWith(`@${spaceID}`)) : keys;
};

export const hasRelated = (
	related: IRelatedModules | undefined,
	key: ISpaceModuleItemRef,
): boolean => {
	if (!related) {
		return false;
	}
	const collectionRelated = (related || {})[key.module] || {};
	const relatedItems = collectionRelated[key.collection];
	return hasRelatedItem(relatedItems, key);
};

const hasRelatedItem = (
	relatedItems: IRelatedItems,
	itemKey: IRelatedItemKey,
): boolean => {
	const { itemID, spaceID } = itemKey;
	return !!relatedItems?.[itemID] || !!relatedItems?.[`${itemID}@${spaceID}`];
};
