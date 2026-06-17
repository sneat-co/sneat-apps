import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ForSpaceTypeCardComponent } from '../../components/for-space-type-card.component';

@Component({
  selector: 'sneat-for-families',
  templateUrl: './for-families.component.html',
  imports: [ForSpaceTypeCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForFamiliesComponent {}
