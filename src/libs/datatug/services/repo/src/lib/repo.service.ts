import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {IDatatugProjectBase} from '@sneat/datatug/models';
import {getRepoUrl} from '@sneat/datatug/nav';
import {IRecordset} from '@sneat/datatug/dto';
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
	console.log('recordsetToGridDef', recordset, hideColumns);
	const columns = recordset.result.columns
		.map((c, i) => ({c, i}))
		.filter(col => {
			const {c} = col;
			if (hideColumns?.indexOf(c.name) >= 0) {
				return false
			}
			const colDef = recordset.def?.columns?.find(cDef => cDef.name === c.name);
			if (colDef?.hideIf?.parameters?.find(pId => recordset.parameters?.find(p => p.id === pId && p.value !== undefined))) {
				return false;
			}
			return true;
		})
		.map(col => {
			const {c} = col;
			const gridCol: IGridColumn = {
				field: '' + col.i,
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
		rows: recordset.result.rows?.map(row => row.reduce(reducer, {}))
	};
	console.log('gridDef', gridDef);
	return gridDef;
};
