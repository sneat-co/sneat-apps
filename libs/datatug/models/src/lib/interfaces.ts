import { IUserRecord } from '@sneat/auth-models';
import { ProjectAccess } from './definition';
import {
	IStoreRef,
	STORE_ID_GITHUB_COM,
	STORE_TYPE_GITHUB,
	StoreType,
} from '@sneat/core';
import { IProjectRef } from '@sneat/datatug-core';

// export interface IRecord<T> { // TODO: duplicate name
//   id: string;
//   state?: RecordState;
//   data?: T;
// }

export interface IDatatugUser extends IUserRecord {
	datatug?: IDatatugBriefForUser;
}

export type IDatatugStoreBriefsById = Record<string, IDatatugStoreBrief>;

export interface IDatatugBriefForUser {
	stores?: IDatatugStoreBriefsById;
}

export interface IDatatugStoreBrief {
	readonly title: string;
	readonly type: DatatugProjStoreType;
	readonly url?: string;
	readonly projects?: Record<string, IProjectBrief>;
}

export interface IDatatugStoreBriefWithId extends IDatatugStoreBrief {
	id: string;
}

export interface IProjectAndStore {
	ref: IProjectRef;
	store: IDatatugStoreBrief;
	project: IProjectBrief;
}

export const cloudStoreId = 'firestore';
export const cloudStoreTitle = 'DataTug cloud';
export const cloudStoreEmoji = '☁️';
export const cloudStoreTitleWithIcon = `${cloudStoreEmoji} ${cloudStoreTitle}`;

export function allUserStoresAsFlatList(
	stores?: IDatatugStoreBriefsById,
): IDatatugStoreBriefWithId[] {
	const result: IDatatugStoreBriefWithId[] = [];
	stores = stores || {};
	if (!stores[cloudStoreId]) {
		stores[cloudStoreId] = {
			type: cloudStoreId,
			title: cloudStoreTitleWithIcon,
		};
	}
	if (!stores[STORE_ID_GITHUB_COM]) {
		stores[STORE_ID_GITHUB_COM] = {
			type: STORE_TYPE_GITHUB,
			title: 'GitHub.com',
		};
	}

	const hasLocalhost = Object.keys(stores).some((v) =>
		v.startsWith('http://localhost:'),
	);
	if (!hasLocalhost) {
		stores = {
			...stores,
			'http://localhost:8989': {
				type: 'agent',
				url: 'http://localhost:8989',
				title: 'localhost:8989',
			},
		};
	}

	for (const id in stores) {
		const store: IDatatugStoreBriefWithId = { ...stores[id], id };
		result.push({
			...store,
			title:
				((store.id === cloudStoreId || store.type === 'firestore') &&
					cloudStoreTitle) ||
				store.title ||
				id,
		});
	}
	return result;
}

export function allUserProjectsAsFlatList(
	stores: IDatatugStoreBriefsById,
): IProjectAndStore[] {
	const projects: IProjectAndStore[] = [];
	for (const storeId in stores) {
		const store = { id: storeId, ...stores[storeId] };
		for (const projectId in store.projects) {
			const project = { id: projectId, ...store.projects[projectId] };
			projects.push({ ref: { projectId, storeId }, store, project });
		}
	}
	return projects;
}

export function projectsBriefFromDictToFlatList(
	projects?: Record<string, IProjectBrief>,
): IDatatugProjectBriefWithId[] {
	const result: IDatatugProjectBriefWithId[] = [];
	if (projects) {
		for (const id in projects) {
			result.push({ ...projects[id], id });
		}
	}
	return result;
}

export type DatatugProjStoreType = StoreType;

export interface IProjStoreRef extends IStoreRef {
	type: DatatugProjStoreType;
	url?: string;
}

export interface IProjectBrief {
	readonly access: ProjectAccess;
	readonly title: string;
	readonly titleOverride?: string;
}

export interface IDatatugProjectBriefWithId extends IProjectBrief {
	readonly id: string;
}

export interface IDatatugProjectBriefWithIdAndStoreRef
	extends IDatatugProjectBriefWithId {
	readonly store: { ref: IProjStoreRef };
}
