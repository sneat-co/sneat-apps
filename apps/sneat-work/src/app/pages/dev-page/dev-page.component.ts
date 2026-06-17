import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sneat-dev-page',
  templateUrl: './dev-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevPageComponent {}
