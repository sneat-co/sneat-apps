import {Injectable} from "@angular/core";
import {RepoApiService} from "./repo-api.service";
import {interval, Observable, of, throwError} from "rxjs";
import {catchError, map, mergeMap, startWith} from "rxjs/operators";

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

@Injectable()
export class AgentStateService {
	private watchers: { [repoId: string]: Observable<IAgentState> } = {};

	constructor(
		private repoApiService: RepoApiService,
	) {
	}

	public watchAgentInfo(repoId: string): Observable<IAgentState> {
		const watcher = this.watchers[repoId] || interval(5000).pipe(
			startWith(0),
			mergeMap(() => this.repoApiService.get<IAgentInfo>(repoId, '/agent-info')),
			map(info => ({info, lastCheckedAt: new Date()})),
			// retryWhen(errors => errors.pipe(
			// 	delayWhen(val => timer(5000)))
			// ),
			catchError(err => {
				console.log('Failed to get agent info:', err);
				if (err.name === 'HttpErrorResponse' && err.ok === false && err.status === 0) {
					const offlineState: IAgentState = {lastCheckedAt: new Date(), isNotAvailable: true};
					// return this.watchAgentInfo(repoId).pipe(
					// 	startWith(offlineState),
					// );
					return of(offlineState);
				}
				return throwError(err);
			}),
		);
		this.watchers[repoId] = watcher;
		return watcher
	}
}
