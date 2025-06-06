import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	IForeignKey,
	IPrimaryKey,
	IReferencedBy,
	ISqlQueryTarget,
	ITableFull,
} from '@sneat/ext-datatug-models';
import { map, mergeMap } from 'rxjs/operators';
import { PrivateTokenStoreService } from '@sneat/auth-core';

@Injectable()
export class TableService {
	private readonly httpClient = inject(HttpClient);
	private readonly privateTokenStoreService = inject(PrivateTokenStoreService);

	public getDbCatalogRefs(
		r: ISqlQueryTarget,
	): Observable<IDbCatalogObjectWithRefs[]> {
		const path = `datatug%2Fservers%2Fdb%2F${r.driver}%2F${r.server}%2Fdbcatalogs%2F${r.catalog}%2F${r.catalog}.refs.json`;

		interface urlAndHeaders {
			url: string;
			headers?: Record<string, string>;
		}

		const connectTo: Observable<urlAndHeaders> = this.privateTokenStoreService
			.getPrivateToken(r.repository, r.project)
			.pipe(
				map((accessToken: string) => ({
					url: `https://gitlabCOMPANY.com/api/v4/projects/${r.project}/repository/files/${path}/raw?ref=master`,
					headers: { 'PRIVATE-TOKEN': accessToken },
				})),
			);

		return connectTo.pipe(
			mergeMap((request) =>
				this.httpClient.get<IDbCatalogObjectWithRefs[]>(request.url, {
					headers: request.headers,
				}),
			),
		);
	}

	public getTableMeta(r: ITableRequest): Observable<ITableFull> {
		const path = `datatug%2Fservers%2Fdb%2F${r.driver}%2F${r.server}%2Fdbcatalogs%2F${r.catalog}%2Fschemas%2F${r.schema}%2Ftables%2F${r.name}%2F${r.schema}.${r.name}.json`;

		interface urlAndHeaders {
			url: string;
			headers?: Record<string, string>;
		}

		const connectTo: Observable<urlAndHeaders> = this.privateTokenStoreService
			.getPrivateToken(r.repository, r.project)
			.pipe(
				map((/*accessToken*/) => ({
					url: `https://gitlab.<AT_COMPANY_HOST>/api/v4/projects/${r.project}/repository/files/${path}/raw?ref=master`,
					headers: { 'PRIVATE-TOKEN': '<TO_BE_SUPPLIEUD>>' },
				})),
			);

		return connectTo.pipe(
			mergeMap((request) =>
				this.httpClient.get<ITableFull>(request.url, {
					headers: request.headers,
				}),
			),
		);
	}
}

export interface ITableRequest extends ISqlQueryTarget {
	schema: string;
	name: string;
}

export interface IDbCatalogObject {
	type: 'table' | 'view';
	schema: string;
	name: string;
	defaultAlias: string;
}

export interface IDbCatalogObjectWithRefs extends IDbCatalogObject {
	primaryKey?: IPrimaryKey;
	foreignKeys?: IForeignKey[];
	referencedBy?: IReferencedBy[];
}
