import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TopMenuService } from '@sneat/core';
import { SpaceBaseComponent } from '@sneat/team-components';

export abstract class SpacePageBaseComponent
	extends SpaceBaseComponent
	implements OnDestroy
{
	protected constructor(
		className: string,
		protected readonly topMenuService: TopMenuService,
		protected readonly cd: ChangeDetectorRef, // readonly navService: TeamNavService,
	) {
		super(className);
	}
}
