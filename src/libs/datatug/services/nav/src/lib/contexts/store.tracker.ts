import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import {routingParamStoreId} from '@sneat/datatug/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

// function factory(route: ActivatedRoute): StoreContextService {
// 	return new StoreContextService(route);
// }

// @Injectable({
// 	providedIn: 'any',
// 	useFactory: factory,
// 	deps: [ActivatedRoute],
// })
export class StoreTracker {
	private readonly stopped: Observable<void>;

	public storeId: Observable<string>;

	constructor(
		readonly stopNotifier: Observable<any>,
		readonly route: ActivatedRoute,
	) {
		this.stopped = stopNotifier;
		this.trackStoreIdParam(route);
	}

	private trackStoreIdParam(route: ActivatedRoute): void {
		this.storeId = route.paramMap
			.pipe(
				takeUntil(this.stopped),
				map(paramMap => paramMap.get(routingParamStoreId)),
			);
	}
}
