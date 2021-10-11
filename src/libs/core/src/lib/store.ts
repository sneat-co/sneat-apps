// Migrated
export const STORE_ID_FIRESTORE = 'firestore';
export const STORE_TYPE_FIRESTORE = 'firestore';

export const STORE_TYPE_GITHUB = 'github';
export const STORE_ID_GITHUB_COM = 'github.com'

export const GITLAB_REPO_PREFIX = 'gitlab.';

export function storeCanProvideListOfProjects(storeId: string): boolean {
	return !(storeId === STORE_ID_FIRESTORE || storeId === STORE_ID_GITHUB_COM);
}

export type StoreType = 'firestore' | 'agent' | 'browser' | 'github' | 'gitlab';

export interface IStoreRef {
	type: StoreType;
	id?: string;
	url?: string;
}

export function storeRefToId(ref: IStoreRef): string {
	switch (ref.type) {
		case 'firestore':
		case 'github':
			return ref.url || ref.type;
		case 'gitlab':
		case 'agent':
			if (ref.url) {
				return ref.url;
			}
			throw new Error('store with type "agent" must have URL')
		default:
			return ``
	}
}

export function parseStoreRef(storeId: string): IStoreRef {
	if (!storeId) {
		throw new Error('storeId is a required parameter');
	}
	switch (storeId) {
		case 'firestore':
		case 'github':
			return {type: storeId};
		case 'github.com':
			return {type: 'github'};
		default:
			if (storeId.startsWith('http-') || storeId.startsWith('https-')) {
				return {type: 'agent', url: storeId.replace('-', '://')}
			}
			throw new Error('unsupported format of store id:' + storeId);
	}
}
