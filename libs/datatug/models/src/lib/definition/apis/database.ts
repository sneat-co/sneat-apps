export interface IEnvDatabaseBase {
	id: string;
	title?: string;
	server: IDbServer;
	driver: 'sqlserver' | string;
}

export interface IColumn {
	name: string;
	dbType: string;
}

export interface ITableFull {
	schema: string;
	name: string;
	dbType: 'BASE TABLE' | 'VIEW' | string;
	columns?: IColumn[];
	primaryKey?: IPrimaryKey;
	foreignKeys?: IForeignKey[];
	referencedBy?: IReferencedBy[];
}

export interface IPrimaryKey {
	name: string;
	columns: string[];
}

export interface IReferencedBy {
	name: string;
	schema: string;
	foreignKeys: IForeignKey[];
}

export interface ITableRef {
	name: string;
	schema: string;
	catalog?: string;
}
export interface IForeignKey {
	name: string;
	columns: string[];
	refTable: ITableRef;
}

export interface IDatabaseFull extends IEnvDatabaseBase {
	tables: ITableFull[];
	views: ITableFull[];
	version?: {
		min?: string;
		max?: string;
	};
}

export interface IDatabaseSummary {
	id: string;
	title?: string;
	environments?: string[];
}

export interface IServer {
	host: string;
	port?: number;
}

export interface IDbServer extends IServer {
	driver: string;
}

export interface IProjDbServerSummary {
	dbServer: IDbServer;
	databasesCount: number;
}

export interface IProjDbServerFull extends IDbServer {
	dbServer: IDbServer;
	databases: IDatabaseFull[];
}

export interface IDbServerSummary extends IDbServer {
	title?: string;
	databases?: IDatabaseSummary[];
}

export interface IDbCatalogSummary {
	name: string;
}

export const getDbServerFromId = (driver: string, id: string): IDbServer => {
	const v = id.split(':');
	if (v.length === 1) {
		return { driver, host: v[0] };
	}
	return { driver, host: v[0], port: +v[0] };
};
