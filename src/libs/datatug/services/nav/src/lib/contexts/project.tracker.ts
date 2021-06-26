import {ActivatedRoute} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {StoreTracker} from './store.tracker';
import {filter, map, takeUntil} from 'rxjs/operators';
import {IProjectRef, routingParamProjectId} from '@sneat/datatug/core';

export class ProjectTracker {
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
		if (!route) {
			throw new Error('route is a required parameter for StoreTracker')
		}
		this.storeTracker = new StoreTracker(stopNotifier, route);
		this.projectId = route.paramMap.pipe(
			takeUntil(stopNotifier),
			map(paramMap => paramMap.get(routingParamProjectId))
		);
		this.projectRef = combineLatest([this.storeTracker.storeId, this.projectId])
			.pipe(
				filter(([storeId, projectId]) => !!storeId && !!projectId),
				map(([storeId, projectId]) => ({storeId, projectId})),
			);
	}
}
