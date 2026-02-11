import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TopMenuService } from '@sneat/core';
import { SpaceBaseComponent } from '@sneat/space-components';

export abstract class SpacePageBaseComponent
  extends SpaceBaseComponent
  implements OnDestroy
{
  protected constructor(
    protected readonly topMenuService: TopMenuService,
    protected readonly cd: ChangeDetectorRef, // readonly navService: TeamNavService,
  ) {
    super();
  }
}
