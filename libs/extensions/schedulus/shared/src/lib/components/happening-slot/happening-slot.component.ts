import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import {
	emptyHappeningSlot,
	IHappeningContext,
	IHappeningSlotWithID,
	WdToWeekdayPipe,
} from '@sneat/mod-schedulus-core';
import { HappeningSlotModalService } from '../happening-slot-form/happening-slot-modal.service';

@Component({
	selector: 'sneat-happening-slot',
	templateUrl: 'happening-slot.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule, // TODO(help-wanted): Can we import just specific pipe?
		WdToWeekdayPipe,
	],
})
export class HappeningSlotComponent {
	@Input({ required: true }) public happening?: IHappeningContext;
	@Input({ required: true }) public slot: IHappeningSlotWithID =
		emptyHappeningSlot;

	constructor(
		private readonly happeningSlotModalService: HappeningSlotModalService,
	) {}

	protected deleting = false;

	protected async editHappeningSlot(event: Event): Promise<void> {
		if (!this.happening) {
			return Promise.reject('no happening');
		}
		if (!this.happening) {
			return Promise.reject('no happening');
		}
		await this.happeningSlotModalService.editSingleHappeningSlot(
			event,
			this.happening,
			undefined,
			this.slot,
		);
	}
}
