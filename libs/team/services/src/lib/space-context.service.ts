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
	// ): Observable<ITeamContext | undefined> {
	// 	return route.paramMap.pipe(
	// 		map(params => {
	// 			const id = params.get('teamID') || undefined;
	// 			const teamContext: ITeamContext | undefined = id ? { id } : undefined;
	// 			return teamContext;
	// 		}),
	// 	);
	// }
}

export function trackSpaceIdAndTypeFromRouteParameter(
	paramMap$: Observable<ParamMap>,
): Observable<ISpaceContext | undefined> {
	return paramMap$.pipe(
		map((params) => {
			const id = params.get('teamID'),
				type = params.get('teamType') as SpaceType;
			console.log('trackTeamIdAndTypeFromRouteParameter', params, id, type);
			const spaceContext: ISpaceContext | undefined = id
				? { id: id, type: type || undefined }
				: undefined;
			// console.log('trackTeamIdAndTypeFromRouteParameter() => teamContext:', teamContext)
			return spaceContext;
		}),
		distinctUntilChanged(
			(previous, current) =>
				previous?.id === current?.id && previous?.type == current?.type,
		),
	);
}
