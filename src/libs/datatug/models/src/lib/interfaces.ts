import {IUserRecord} from '@sneat/auth-models';
import {IStoreRef, StoreType} from "@sneat/api";


// export interface IRecord<T> { // TODO: duplicate name
//   id: string;
//   state?: RecordState;
//   data?: T;
// }

export interface IDatatugUser extends IUserRecord {
	datatug?: IDatatugBriefForUser;
}

export interface IDatatugBriefForUser {
	stores?: { [id: string]: IDatatugStoreBrief };

}

export interface IDatatugStoreBrief {
	id?: string
	title: string;
	type: DataTugProjStoreType;
	url?: string;
	projects?: { [id: string]: IDatatugProjectBrief };
}

export interface IProjectAndStore {
	store: IDatatugStoreBrief;
	project: IDatatugProjectBrief;
}

const cloudStoreTitle = '☁️ DataTug cloud';

export function allUserStoresAsFlatList(stores?: { [id: string]: IDatatugStoreBrief }): IDatatugStoreBrief[] {
	const result: IDatatugStoreBrief[] = [];
	if (stores) {
		for (const storeId in stores) {
			let store = stores[storeId];
			store = {id: storeId, ...store, title: store.title || store.id};
			if (store.id === 'firestore' || store.type === 'firestore') {
				store.title = cloudStoreTitle;
			} else {
				store.title = '💻 ' + store.title;
			}
			result.push(store);
		}
	}
	if (!result.some(store => store.id !== 'firestore')) {
		result.push({id: 'firestore', title: cloudStoreTitle, type: 'firestore'})
	}
	return result;
}

export function allUserProjectsAsFlatList(stores: { [id: string]: IDatatugStoreBrief }): IProjectAndStore[] {
	const projects: IProjectAndStore[] = [];
	for (const storeId in stores) {
		const store = {id: storeId, ...stores[storeId]};
		for (const projectId in store.projects) {
			const project = {id: projectId, ...store.projects[projectId]};
			projects.push({store, project});
		}
	}
	return projects;
}

export function projectsBriefFromDictToFlatList(projects?: { [id: string]: IDatatugProjectBrief })
	: IDatatugProjectBrief[] {
	const result: IDatatugProjectBrief[] = [];
	if (projects) {
		for (const id in projects) {
			result.push({...projects[id], id});
		}
	}
	return result;
}

export type DataTugProjStoreType = StoreType;

export interface IProjStoreRef extends IStoreRef {
	type: DataTugProjStoreType;
	url?: string;
}

export interface IDatatugProjectBrief {
	readonly id: string;
	readonly store: IProjStoreRef;
	readonly title?: string;
	readonly titleOverride?: string;
}

export type MetricColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning';

export interface IBoolMetricVal {
	label: string;
	color: MetricColor;
}

export interface IBoolMetric {
	true: IBoolMetricVal;
	false: IBoolMetricVal;
}


interface IInvite {
	message?: string;
}

interface IPerson {
	title: string;
	email: string;
}

export interface IPersonalInvite extends IInvite {
	channel: string;
	address: string;
	team: { id: string; title: string };
	memberId: string;
	from: IPerson;
	to: IPerson;
}

