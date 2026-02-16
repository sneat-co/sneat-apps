import {
  Component,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { WithSpaceInput } from '@sneat/space-services';
import { ISpaceContext } from '@sneat/space-models';

@Component({
  template: '',
})
export abstract class SpaceRelatedFormComponent
  extends WithSpaceInput
  implements OnChanges
{
  // TODO: Needs to be in other place

  ngOnChanges(changes: SimpleChanges): void {
    const spaceChange = changes['$space'];
    if (spaceChange) {
      this.onSpaceChanged(spaceChange);
    }
  }

  protected onSpaceChanged(teamChange: SimpleChange): void {
    const previous = teamChange.previousValue as ISpaceContext | undefined;
    const current = teamChange.currentValue as ISpaceContext | undefined;
    if (previous?.type !== current?.type) {
      this.onSpaceTypeChanged(current);
    }
  }

  protected onSpaceTypeChanged(_space?: ISpaceContext): void {
    // TODO: remove in favor of $spaceType?
    // console.log('SpaceRelatedFormComponent.onSpaceTypeChanged()', team);
  }
}
