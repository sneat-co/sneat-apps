import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';
import { IonText } from '@ionic/angular/standalone';
import { ISlotAdjustment, ITiming } from '@sneat/mod-schedulus-core';

@Component({
	selector: 'sneat-timing-badge',
	templateUrl: 'timing-badge.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonText],
})
export class TimingBadgeComponent {
	public readonly $isCanceled = input.required<boolean>();
	public readonly $timing = input.required<ITiming>();
	public readonly $adjustment = input.required<ISlotAdjustment | undefined>();

	protected readonly $startTime = computed(() => this.$timing().start?.time);
	protected readonly $endTime = computed(() => this.$timing().end?.time);
	protected readonly $hasEnd = computed(() => !!this.$timing().end);
	protected readonly $hasEndTime = computed(() => !!this.$endTime());

	protected readonly $adjustedStartTime = computed(
		() => this.$adjustment()?.adjustment?.start?.time,
	);
	protected readonly $adjustedEndTime = computed(
		() => this.$adjustment()?.adjustment?.end?.time,
	);
	protected readonly $hasAdjustedEnd = computed(
		() => !!this.$adjustment()?.adjustment?.end,
	);
	protected readonly $hasAdjustedEndTime = computed(
		() => !!this.$adjustedEndTime(),
	);
}
