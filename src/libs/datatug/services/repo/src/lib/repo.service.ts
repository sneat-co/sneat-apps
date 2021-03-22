import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {IExecuteRequest, IDatatugProjectBase} from '@sneat/datatug/models';
import {getRepoUrl} from '@sneat/datatug/nav';
import {IExecuteResponse, IRecordset, ISelectRequest} from '@sneat/datatug/dto';
import {IGridColumn, IGridDef} from '@sneat/grid';

@Injectable()
export class RepoService {

	private readonly projectsByAgent: { [repoId: string]: Observable<IDatatugProjectBase[]> } = {};

	constructor(
		private readonly http: HttpClient,
	) {
		console.log('RepoService.constructor()');
	}

	public getProjects(repoId: string): Observable<IDatatugProjectBase[]> {
		// eslint-disable-next-line no-console
		console.log('getProjects', repoId);
		if (!repoId) {
			return throwError('Parameter "repoId" is required');
		}
		let projects = this.projectsByAgent[repoId]
		if (projects) {
			return projects;
		}
		const agentUrl = getRepoUrl(repoId);
		projects = this.http.get<IDatatugProjectBase[]>(`${agentUrl}/projects`)
			.pipe(shareReplay(1));
		this.projectsByAgent[repoId] = projects;
		return projects;
	}

}


export const recordsetToGridDef = (recordset: IRecordset, hideColumns?: string[]): IGridDef => {
	const columns = recordset.columns.filter(c => !hideColumns?.length || hideColumns.indexOf(c.name) < 0).map((c, index) => {
		const gridCol: IGridColumn = {
			field: '' + index,
			colName: c.name,
			dbType: c.dbType,
			title: c.name
		};
		return gridCol;
	});
	const reducer = (r, v, i) => {
		r['' + i] = v;
		return r;
	};
	const gridDef: IGridDef = {
		columns,
		rows: recordset.rows.map(row => row.reduce(reducer, {}))
	};
	console.log('gridDef', gridDef);
	return gridDef;
};
