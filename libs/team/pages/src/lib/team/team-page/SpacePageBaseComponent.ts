import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopMenuService } from '@sneat/core';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';

export abstract class SpacePageBaseComponent
	extends SpaceBaseComponent
	implements OnDestroy
{
	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		protected readonly topMenuService: TopMenuService,
		protected readonly cd: ChangeDetectorRef, // readonly navService: TeamNavService,
	) {
		super(className, route, params);
	}
}
