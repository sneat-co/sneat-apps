// Migrated
export const STORE_ID_FIRESTORE = 'firestore';
export const STORE_TYPE_FIRESTORE = 'firestore';

export const STORE_TYPE_GITHUB = 'github';
export const STORE_ID_GITHUB_COM = 'github.com'

export const GITLAB_REPO_PREFIX = 'gitlab.';

export function storeCanProvideListOfProjects(storeId: string): boolean {
	return !(storeId === STORE_ID_FIRESTORE || storeId === STORE_ID_GITHUB_COM);
}
