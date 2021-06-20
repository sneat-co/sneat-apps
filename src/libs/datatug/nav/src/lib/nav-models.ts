import {
	IDatatugProjectBrief, IDatatugProjectBriefWithIdAndStoreRef,
	IDatatugProjectSummary,
	IEnvironmentSummary,
	IProjEnv,
	ITableFull
} from '@sneat/datatug/models';
import {IDatatugProjRef} from "@sneat/datatug/core";

export interface IDatatugProjectContext extends IDatatugProjRef {
	readonly brief: IDatatugProjectBriefWithIdAndStoreRef;
	readonly summary?: IDatatugProjectSummary;
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
