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
	public readonly storeId: Observable<string>;

	constructor(
		private readonly stopNotifier: Observable<any>,
		readonly route: ActivatedRoute,
	) {
		if (!stopNotifier) {
			throw new Error('stopNotifier is a required parameter for StoreTracker')
		}
		if (!route) {
			throw new Error('route is a required parameter for StoreTracker')
		}
		this.storeId = route.paramMap
			.pipe(
				takeUntil(stopNotifier),
				map(paramMap => paramMap.get(routingParamStoreId)),
			);
	}

}
