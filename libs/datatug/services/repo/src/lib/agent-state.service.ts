import { Injectable } from '@angular/core';
import { StoreApiService } from './store-api.service';
import { interval, Observable, of, throwError } from 'rxjs';
import { catchError, first, map, startWith, switchMap } from 'rxjs/operators';

export interface IAgentInfo {
	version: string;
	uptimeMinutes: number;
}

export interface IAgentState {
	lastCheckedAt: Date;
	info?: IAgentInfo;
	isNotAvailable?: boolean;
	error?: unknown;
}

const periodMs = 10000;

@Injectable()
export class AgentStateService {
	private watchers: { [storeId: string]: Observable<IAgentState> } = {};

	constructor(private repoApiService: StoreApiService) {}

	public getAgentInfo(storeId: string): Observable<IAgentState> {
		return this.watchAgentInfo(storeId).pipe(first());
	}

	public watchAgentInfo(storeId: string): Observable<IAgentState> {
		let watcher = this.watchers[storeId];
		if (watcher) {
			return watcher;
		}
		watcher = interval(periodMs).pipe(
			startWith(0),
			switchMap(() =>
				this.repoApiService.get<IAgentInfo>(storeId, '/agent-info').pipe(
					catchError((err) => {
						console.log('Failed to get agent info:', err);
						if (
							err.name === 'HttpErrorResponse' &&
							err.ok === false &&
							err.status === 0
						) {
							return of(undefined);
						}
						return throwError(err);
					}),
				),
			),
			map((info) => ({
				info,
				lastCheckedAt: new Date(),
				isNotAvailable: info === undefined,
			})),
		);
		this.watchers[storeId] = watcher;
		return watcher;
	}
}
