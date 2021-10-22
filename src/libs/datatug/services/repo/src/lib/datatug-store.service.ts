import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import {
	cloudStoreId,
	IProjectBase,
	projectsBriefFromDictToFlatList,
} from '@sneat/datatug/models';
import { getStoreUrl } from '@sneat/datatug/nav';
import { IRecordset } from '@sneat/datatug/dto';
import { IGridColumn, IGridDef } from '@sneat/grid';
import {
	DatatugUserService,
	IDatatugUserState,
} from '@sneat/datatug/services/base';
import { storeCanProvideListOfProjects } from '@sneat/core';

@Injectable()
export class DatatugStoreService {
	private readonly projectsByStore: {
		[storeId: string]: Observable<IProjectBase[]>;
	} = {};

	private datatugUserState: IDatatugUserState;

	constructor(
		private readonly http: HttpClient,
		private readonly datatugUserService: DatatugUserService
	) {
		console.log('StoreService.constructor()');
		datatugUserService.datatugUserState.subscribe({
			next: (datatugUserState) => {
				this.datatugUserState = datatugUserState;
			},
		});
	}

	public getProjects(storeId: string): Observable<IProjectBase[]> {
		// eslint-disable-next-line no-console
		console.log('getProjects', storeId);
		if (!storeId) {
			return throwError(() => 'Parameter "storeId" is required');
		}
		if (!storeCanProvideListOfProjects(storeId)) {
			return this.datatugUserService.datatugUserState.pipe(
				map((datatugUserState) => {
					const result: IProjectBase[] = [];
					//
					const { record } = datatugUserState;
					const store = record?.datatug?.stores[storeId];
					projectsBriefFromDictToFlatList(store?.projects).forEach((p) => {
						result.push(p as IProjectBase); // TODO: casting is dirty hack
					});
					//
					result.push({
						id: 'demo-project',
						title: 'Demo project',
						access: 'public',
					});
					return result;
				})
			);
		}
		let projects = this.projectsByStore[storeId];
		if (projects) {
			return projects;
		}
		const storeUrl = getStoreUrl(storeId);
		projects = this.http
			.get<IProjectBase[]>(`${storeUrl}/projects`)
			.pipe(shareReplay(1));
		this.projectsByStore[storeId] = projects;
		return projects;
	}
}

export const recordsetToGridDef = (
	recordset: IRecordset,
	hideColumns?: string[]
): IGridDef => {
	console.log('recordsetToGridDef', recordset, hideColumns);
	const columns = recordset.result.columns
		.map((c, i) => ({ c, i }))
		.filter((col) => {
			const { c } = col;
			if (hideColumns?.indexOf(c.name) >= 0) {
				return false;
			}
			const colDef = recordset.def?.columns?.find(
				(cDef) => cDef.name === c.name
			);
			if (
				colDef?.hideIf?.parameters?.find((pId) =>
					recordset.parameters?.find(
						(p) => p.id === pId && p.value !== undefined
					)
				)
			) {
				return false;
			}
			return true;
		})
		.map((col) => {
			const { c } = col;
			const gridCol: IGridColumn = {
				field: '' + col.i,
				colName: c.name,
				dbType: c.dbType,
				title: c.name,
			};
			return gridCol;
		});
	const reducer = (r, v, i) => {
		r['' + i] = v;
		return r;
	};
	const gridDef: IGridDef = {
		columns,
		rows: recordset.result.rows?.map((row) => row.reduce(reducer, {})),
	};
	console.log('gridDef', gridDef);
	return gridDef;
};
