import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonBadge, IonText } from '@ionic/angular/standalone';
import { ISlotAdjustment, ITiming } from '@sneat/mod-schedulus-core';

@Component({
	selector: 'sneat-timing-badge',
	templateUrl: 'timing-badge.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonBadge, IonText],
})
export class TimingBadgeComponent {
	@Input({ required: true }) isCanceled?: boolean;
	@Input({ required: true }) timing?: ITiming;
	@Input({ required: true }) adjustment?: ISlotAdjustment;
}
