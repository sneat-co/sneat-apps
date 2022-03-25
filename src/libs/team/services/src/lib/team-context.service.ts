import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITeamContext, TeamType } from '@sneat/team/models';

@Injectable({
	providedIn: 'root',
})
export class TeamContextService {

	public trackUrl(
		route: ActivatedRoute,
		paramName: string,
	): Observable<ITeamContext | undefined> {
		return route.paramMap.pipe(
			map(params => {
				const id = params.get('teamId') || undefined;
				const teamContext: ITeamContext | undefined = id ? { id } : undefined;
				return teamContext;
			}),
		);
	}
}

export function trackTeamIdAndTypeFromRouteParameter(route: ActivatedRoute): Observable<ITeamContext | undefined> {
	return route.paramMap.pipe(
		map(params => {
			const
				id = params.get('teamId'),
				type = params.get('teamType') as TeamType;
			const teamContext: ITeamContext | undefined = id ? { id: id, type: type || undefined } : undefined;
			console.log('trackTeamIdAndTypeFromRouteParameter() => teamContext:', teamContext)
			return teamContext;
		}),
		distinctUntilChanged(
			(previous, current) =>
				previous?.id === current?.id && previous?.type == current?.type,
		),
	);
}
