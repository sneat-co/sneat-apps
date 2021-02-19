import {IDbServer} from '@sneat/datatug/models';

export interface CreateNamedRequest {
	project: string;
	name: string;
}

export interface GetServerDatabasesRequest {
	project?: string;
	dbServer: IDbServer;
}
