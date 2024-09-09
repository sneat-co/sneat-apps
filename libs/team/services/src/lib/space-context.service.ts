import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { distinctUntilChanged, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceType } from '@sneat/core';

@Injectable({
	providedIn: 'root',
})
export class SpaceContextService {
	// public trackUrl(
	// 	route: ActivatedRoute,
	// 	paramName: string,
	// ): Observable<ISpaceContext | undefined> {
	// 	return route.paramMap.pipe(
	// 		map(params => {
	// 			const id = params.get('spaceID') || undefined;
	// 			const spaceContext: ISpaceContext | undefined = id ? { id } : undefined;
	// 			return spaceContext;
	// 		}),
	// 	);
	// }
}

export function trackSpaceIdAndTypeFromRouteParameter(
	paramMap$: Observable<ParamMap>,
): Observable<ISpaceContext | undefined> {
	return paramMap$.pipe(
		map((params) => {
			const id = params.get('spaceID'),
				type = params.get('spaceType') as SpaceType;
			// console.log('trackSpaceIdAndTypeFromRouteParameter', params, id, type);
			const spaceContext: ISpaceContext | undefined = id
				? { id: id, type: type || undefined }
				: undefined;
			// console.log('trackSpaceIdAndTypeFromRouteParameter() => spaceContext:', spaceContext)
			return spaceContext;
		}),
		distinctUntilChanged(
			(previous, current) =>
				previous?.id === current?.id && previous?.type == current?.type,
		),
	);
}
