import {
	IDatatugProjectBrief, IDatatugProjectBriefWithIdAndStoreRef,
	IProjectSummary,
	IEnvironmentSummary,
	IProjEnv,
	ITableFull
} from '@sneat/datatug/models';
import {IProjectRef} from "@sneat/datatug/core";
import {IStoreRef, parseStoreRef} from '@sneat/core';

export interface IProjectContext {
	readonly ref: IProjectRef;
	readonly store: {
		readonly ref: IStoreRef;
	}
	readonly brief?: IDatatugProjectBrief;
	readonly summary?: IProjectSummary;
}

export function newProjectContextFromRef(ref: IProjectRef): IProjectContext {
	return {ref, store: {ref: parseStoreRef(ref.storeId)}};
}


export interface IEnvContext {
	readonly id: string;
	readonly brief?: IProjEnv;
	readonly summary?: IEnvironmentSummary;
}

export interface IEnvDbContext {
	readonly id: string;
}

export interface IEnvDbTableContext {
	schema: string;
	name: string;
	meta?: ITableFull,
}

export interface IDatatugNavContext {
	readonly projectId?: string;
	readonly envId?: string;
	readonly dbId?: string;
}

export interface IAgentContext {
	protocol: 'http' | 'https';
	host: string;
	port: number;
}

export const getStoreId = (repo: string): string => {
	if (repo.startsWith('http://')) {
		return repo.replace('http://', 'http-')
	} else if (repo.startsWith('https://')) {
		return repo.replace('https://', 'https-')
	}
	return repo;
}

export const getStoreUrl = (storeId: string): string => {
	if (!storeId || storeId.startsWith('http://') || storeId.startsWith('https://')) {
		return storeId;
	}
	if (storeId.startsWith('http-')) {
		return storeId.replace('http-', 'http://');
	}
	if (storeId.startsWith('https-')) {
		return storeId.replace('https-', 'https://');
	}
	const a = storeId.split(':');
	storeId = `//${a[0]}:${a[1]}`;
	if (a[2]) {
		storeId += ':' + a[2];
	}
	return storeId;
};
