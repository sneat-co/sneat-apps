import {Injectable} from "@angular/core";
import {RepoApiService} from "./repo-api.service";
import {interval, Observable, of, throwError} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";

export interface IAgentInfo {
	version: string;
	uptimeMinutes: number;
}

export interface IAgentState {
	lastCheckedAt: Date;
	info?: IAgentInfo;
	isNotAvailable?: boolean;
	error?: any;
}

const periodMs = 10000;

@Injectable()
export class AgentStateService {
	private watchers: { [repoId: string]: Observable<IAgentState> } = {};

	constructor(
		private repoApiService: RepoApiService,
	) {
	}

	public watchAgentInfo(repoId: string): Observable<IAgentState> {
		let watcher = this.watchers[repoId];
		if (watcher) {
			return watcher;
		}
		watcher = interval(periodMs)
			.pipe(
				startWith(0),
				switchMap(() => this.repoApiService.get<IAgentInfo>(repoId, '/agent-info')
					.pipe(catchError(err => {
						console.log('Failed to get agent info:', err);
						if (err.name === 'HttpErrorResponse' && err.ok === false && err.status === 0) {
							return of(undefined);
						}
						return throwError(err);
					}))),
				map(info => ({info, lastCheckedAt: new Date(), isNotAvailable: info === undefined})),
			)
		;
		this.watchers[repoId] = watcher;
		return watcher
	}
}
