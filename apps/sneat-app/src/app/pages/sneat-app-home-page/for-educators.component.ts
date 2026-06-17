import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ForSpaceTypeCardComponent } from '../../components/for-space-type-card.component';

@Component({
  selector: 'sneat-for-educators',
  templateUrl: './for-educators.component.html',
  imports: [ForSpaceTypeCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForEducatorsComponent {}
