import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class TeamContextService {
	private readonly $currentTeamId = new BehaviorSubject<string | undefined>(
		undefined
	);
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public currentTeamId = this.$currentTeamId.asObservable();

	public trackUrl(
		route: ActivatedRoute,
		paramName: string
	): Observable<string | undefined> {
		return route.queryParamMap.pipe(
			map(params => params.get(paramName) || undefined),
			map(paramValue => this.setActiveTeamId(paramValue)),
			tap(id => console.log("team ID:", id))
		);
	}

	public setActiveTeamId(id: string | undefined): string | undefined {
		this.$currentTeamId.next(id);
		return id;
	}
}
