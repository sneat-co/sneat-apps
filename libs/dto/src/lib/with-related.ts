import { IWithCreatedShort } from './dto-with-modified';

export interface ISpaceModuleItemRef {
	readonly space: string;
	readonly module: string;
	readonly collection: string;
	readonly itemID: string;
}

export interface IRelationshipRole {
	readonly created: IWithCreatedShort;
}

export type IRelationshipRoles = Readonly<Record<string, IRelationshipRole>>;

export interface IRelatedItemKey {
	readonly spaceID: string;
	readonly itemID: string;
}

export interface IRelatedItem {
	readonly keys: readonly IRelatedItemKey[];
	readonly rolesOfItem?: IRelationshipRoles; // if related item is a child of the current record, then rolesOfItem = {"child": ...}
	readonly rolesToItem?: IRelationshipRoles; // if related item is a child of the current contact, then rolesToItem = {"parent": ...}
}

export type IRelatedItemsByCollection = Readonly<
	Record<string, IRelatedItem[]>
>;

export type IRelatedItemsByModule = Readonly<
	Record<string, IRelatedItemsByCollection>
>;

export function getRelatedItems(
	moduleId: string,
	collectionId: string,
	related?: IRelatedItemsByModule,
): readonly IRelatedItem[] {
	return (related && related[moduleId]?.[collectionId]) || [];
}

export interface IWithRelatedOnly {
	readonly related?: IRelatedItemsByModule;
}

export interface IWithRelatedAndRelatedIDs extends IWithRelatedOnly {
	readonly relatedIDs?: readonly string[];
}

export const addRelatedItem = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	spaceID: string,
	itemID: string,
) => {
	related = related || {};
	let collectionRelated = related[module] || {};
	let relatedItems = collectionRelated[collection] || [];
	if (!hasRelated(related, module, collection, { spaceID, itemID })) {
		relatedItems = [...(relatedItems || []), { keys: [{ spaceID, itemID }] }];
		collectionRelated = { ...collectionRelated, [collection]: relatedItems };
		related = { ...related, [module]: collectionRelated };
	}
	return related;
};

export const removeRelatedItem = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	spaceID: string,
	itemID: string,
) => {
	if (!related) {
		return related;
	}
	let collectionRelated = related[module];
	if (!collectionRelated) {
		return related;
	}
	let relatedItems = collectionRelated[collection];
	if (!relatedItems) {
		return related;
	}
	const itemKey: IRelatedItemKey = { spaceID, itemID };
	if (hasRelated(related, module, collection, itemKey)) {
		relatedItems = relatedItems.filter(
			(item) =>
				!item.keys.some(
					(key) =>
						key.itemID === itemKey.itemID && key.spaceID === itemKey.spaceID,
				),
		);
		collectionRelated = { ...collectionRelated, [collection]: relatedItems };
		related = { ...related, [module]: collectionRelated };
	}
	return related;
};

export const getRelatedItemByKey = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	spaceID: string,
	itemID: string,
): IRelatedItem | undefined => {
	if (!related) {
		return undefined;
	}
	const collectionRelated = (related || {})[module] || {};
	const relatedItems = collectionRelated[collection];
	return relatedItems.find((i) =>
		i.keys.some((k) => k.spaceID === spaceID && k.itemID === itemID),
	);
};

export const getRelatedItemIDs = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	teamID?: string,
): readonly string[] => {
	if (!related) {
		return [];
	}
	const collectionRelated = (related || {})[module] || {};
	const relatedItems = collectionRelated[collection];
	const itemIDs = relatedItems
		?.map((i) =>
			i.keys
				.filter((k) => !teamID || k.spaceID === teamID)
				.map((k) => k.itemID),
		)
		?.flat();
	return itemIDs || [];
};

export const hasRelated = (
	related: IRelatedItemsByModule | undefined,
	module: string,
	collection: string,
	itemKey: IRelatedItemKey,
): boolean => {
	if (!related) {
		return false;
	}
	const collectionRelated = (related || {})[module] || {};
	const relatedItems = collectionRelated[collection];
	return hasRelatedItem(relatedItems, itemKey);
};

const hasRelatedItem = (
	relatedItems: readonly IRelatedItem[],
	itemKey: IRelatedItemKey,
) => {
	const { itemID, spaceID } = itemKey;
	return relatedItems?.some((i) =>
		i.keys.some((k) => k.itemID === itemID && k.spaceID === spaceID),
	);
};
