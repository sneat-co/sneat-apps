import {
	IDatatugProjectBrief,
	IDatatugProjectSummary,
	IEnvironmentSummary,
	IProjEnv,
	ITableFull
} from '@sneat/datatug/models';
import {IDatatugProjRef} from "@sneat/datatug/core";

export interface IDatatugProjectContext extends IDatatugProjRef {
	readonly brief: IDatatugProjectBrief;
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

export const getRepoId = (repo: string): string => {
	if (repo.startsWith('http://')) {
		return repo.replace('http://', 'http-')
	} else if (repo.startsWith('https://')) {
		return  repo.replace('https://', 'https-')
	}
	return repo;
}

export const getRepoUrl = (repo: string): string => {
	if (!repo || repo.startsWith('http://') || repo.startsWith('https://')) {
		return repo;
	}
	if (repo.startsWith('http-')) {
		return repo.replace('http-', 'http://');
	}
	if (repo.startsWith('https-')) {
		return repo.replace('https-', 'https://');
	}
	const a = repo.split(':');
	repo = `//${a[0]}:${a[1]}`;
	if (a[2]) {
		repo += ':' + a[2];
	}
	return repo;
};
