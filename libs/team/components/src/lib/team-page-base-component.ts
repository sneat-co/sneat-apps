import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from './team-component-base-params';
import { TeamBaseComponent } from './team-base.component';

@Injectable() // we need this decorator so we can implement Angular interfaces
export abstract class TeamPageBaseComponent extends TeamBaseComponent {
	protected constructor(
		// we need this fake token so we can implement Angular interfaces
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
	) {
		super(className, route, teamParams);
	}
}
