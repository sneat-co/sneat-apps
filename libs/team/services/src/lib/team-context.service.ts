import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITeamContext } from '@sneat/team/models';
import { TeamType } from '@sneat/core';

@Injectable({
	providedIn: 'root',
})
export class TeamContextService {

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

export function trackTeamIdAndTypeFromRouteParameter(route: ActivatedRoute): Observable<ITeamContext | undefined> {
	return route.paramMap.pipe(
		map(params => {
			const
				id = params.get('teamID'),
				type = params.get('teamType') as TeamType;
			console.log('trackTeamIdAndTypeFromRouteParameter', params, id, type);
			const teamContext: ITeamContext | undefined = id ? { id: id, type: type || undefined } : undefined;
			// console.log('trackTeamIdAndTypeFromRouteParameter() => teamContext:', teamContext)
			return teamContext;
		}),
		distinctUntilChanged(
			(previous, current) =>
				previous?.id === current?.id && previous?.type == current?.type,
		),
	);
}
