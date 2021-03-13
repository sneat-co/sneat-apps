import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {IExecuteRequest, IProjectBase} from '@sneat/datatug/models';
import {getRepoUrl} from '@sneat/datatug/nav';
import {IExecuteResponse, IRecordset, ISelectRequest} from '@sneat/datatug/dto';
import {IGridColumn, IGridDef} from '@sneat/grid';

@Injectable()
export class RepoService {

	private readonly projectsByAgent: { [repoId: string]: Observable<IProjectBase[]> } = {};

	constructor(
		private readonly http: HttpClient,
	) {
		console.log('RepoService.constructor()');
	}

	public getProjects(repoId: string): Observable<IProjectBase[]> {
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
		projects = this.http.get<IProjectBase[]>(`${agentUrl}/projects`)
			.pipe(shareReplay(1));
		this.projectsByAgent[repoId] = projects;
		return projects;
	}

	public select(repoId: string, request: ISelectRequest): Observable<IExecuteResponse> {
		console.log(`AgentService.select(${repoId})`, request);
		if (!request.proj) {
			return throwError('Client side check failed: !request.proj');
		} else if (request.proj.indexOf('@') >= 0) {
			return throwError('Client side check failed: "@" character in project ID, repo is supposed to be passed independently');
		}
		let params = new HttpParams()
			.append('db', request.db)
			.append('env', request.env)
			.append('proj', request.proj)
		;
		if (request.from) {
			params = params.append('from', request.from)
		} else if (request.sql) {
			params = params.append('sql', request.sql)
		}
		if (request.where) {
			params = params.append('where', request.where);
		}
		if (request.limit) {
			params = params.append('limit', '' + request.limit);
		}
		// eslint-disable-next-line object-shorthand
		const agentUrl = getRepoUrl(repoId);
		return this.http.get<IExecuteResponse>(`${repoId}/select`, {params});
	}

	public execute(repoId: string, request: IExecuteRequest): Observable<IExecuteResponse> {
		console.log(`AgentService.execute(${repoId})`, request);
		if (!request.projectId) {
			return throwError('Client side check failed: !request.proj');
		} else if (request.projectId.indexOf('@') >= 0) {
			return throwError('Client side check failed: "@" character in project ID, repo is supposed to be passed independently');
		}
		const params = new HttpParams()
			.append('project', request.projectId)
		;
		request = {...request, projectId: undefined};
		// eslint-disable-next-line object-shorthand
		const agentUrl = getRepoUrl(repoId);
		return this.http.post<IExecuteResponse>(agentUrl + `/exec/execute_commands`, request, {params});
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
