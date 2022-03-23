import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITeamContext } from '@sneat/team/models';

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

export function trackTeamIdFromRouteParameter(route: ActivatedRoute): Observable<string | null> {
	return route.paramMap.pipe(
		map(params => params.get('teamId')),
		distinctUntilChanged(),
	);
}
