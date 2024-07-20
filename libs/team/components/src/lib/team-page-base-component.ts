import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceComponentBaseParams } from './space-component-base-params.service';
import { SpaceBaseComponent } from './space-base-component.directive';

@Injectable() // we need this decorator so we can implement Angular interfaces
export abstract class TeamPageBaseComponent extends SpaceBaseComponent {
	protected constructor(
		// we need this fake token so we can implement Angular interfaces
		className: string,
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
	) {
		super(className, route, teamParams);
	}
}
