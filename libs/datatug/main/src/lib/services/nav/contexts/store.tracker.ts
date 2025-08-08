import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { routingParamStoreId } from '../../../core/datatug-routing-params';

// function factory(route: ActivatedRoute): StoreContextService {
// 	return new StoreContextService(route);
// }

// @Injectable({
// 	useFactory: factory,
// 	deps: [ActivatedRoute],
// })
export class StoreTracker {
	public readonly storeId: Observable<string | null>;

	constructor(
		private readonly stopNotifier: Observable<unknown>,
		readonly route: ActivatedRoute,
	) {
		if (!stopNotifier) {
			throw new Error('stopNotifier is a required parameter for StoreTracker');
		}
		if (!route) {
			throw new Error('route is a required parameter for StoreTracker');
		}
		this.storeId = route.paramMap.pipe(
			takeUntil(stopNotifier),
			map((paramMap) => paramMap.get(routingParamStoreId)),
			distinctUntilChanged(),
		);
	}
}
