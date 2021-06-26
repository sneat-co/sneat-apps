import {ActivatedRoute} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {StoreTracker} from './store.tracker';
import {map, takeUntil} from 'rxjs/operators';
import {IProjectRef, routingParamProjectId} from '@sneat/datatug/core';

export class ProjectTracker {
	private readonly stopped: Observable<void>;

	public readonly storeTracker: StoreTracker;

	public readonly projectId: Observable<string>;
	public readonly projectRef: Observable<IProjectRef>;

	constructor(
		readonly stopNotifier: Observable<any>,
		readonly route: ActivatedRoute,
	) {
		if (!stopNotifier) {
			throw new Error('stopNotifier is a required parameter for ProjectTracker')
		}
		this.stopNotifier = stopNotifier;
		this.storeTracker = new StoreTracker(stopNotifier, route);
		this.projectId = route.paramMap.pipe(
			takeUntil(this.stopped),
			map(paramMap => paramMap.get(routingParamProjectId))
		);
		this.projectRef = combineLatest([this.storeTracker.storeId, this.projectId])
			.pipe(map(([storeId, projectId]) => ({storeId, projectId})));
	}
}
