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

export const getRepoUrl = (repo: string): string => {
	if (!repo) {
		return repo;
	}
	const a = repo.split(':');
	repo = `//${a[0]}:${a[1]}`;
	if (a[2]) {
		repo += ':' + a[2];
	}
	return repo;
};
