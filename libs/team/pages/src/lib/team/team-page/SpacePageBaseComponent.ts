import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdAndBrief, TopMenuService } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';

export abstract class SpacePageBaseComponent
	extends SpaceBaseComponent
	implements OnDestroy
{
	protected members?: readonly IIdAndBrief<IContactBrief>[]; // TODO: Should be in dedicated component

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
