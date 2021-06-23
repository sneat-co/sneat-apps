import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {StoreTracker} from '@sneat/datatug/services/nav';
import {map, takeUntil} from 'rxjs/operators';
import {routingParamProjectId} from '@sneat/datatug/core';

export class ProjectTracker {
	private readonly stopped: Observable<void>;

	public readonly storeTracker: StoreTracker;

	public projectId: Observable<string>;

	constructor(
		readonly stopNotifier: Observable<any>,
		readonly route: ActivatedRoute,
	) {
		this.stopNotifier = stopNotifier;
		this.storeTracker = new StoreTracker(stopNotifier, route);
		this.trackProjectId(route);
	}

	trackProjectId(route: ActivatedRoute): void {
		this.projectId = route.paramMap.pipe(
			takeUntil(this.stopped),
			map(paramMap => paramMap.get(routingParamProjectId))
		);
	}
}
