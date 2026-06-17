import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IRecord } from '@sneat/data';
import { IRetrospective } from '@sneat/ext-scrumspace-scrummodels';
import { ISpaceContext } from '@sneat/space-models';

@Component({
  selector: 'sneat-retro-review-stage',
  templateUrl: './retro-review-stage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetroReviewStageComponent {
  readonly space = input<ISpaceContext>({ id: '' });
  readonly retrospective = input<IRecord<IRetrospective>>();
}
