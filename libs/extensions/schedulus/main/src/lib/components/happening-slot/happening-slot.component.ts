import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { IHappeningContext, IHappeningSlot } from '@sneat/mod-schedulus-core';
import { HappeningSlotModalService } from '../happening-slot-form/happening-slot-modal.service';

@Component({
	selector: 'sneat-happening-slot',
	templateUrl: 'happening-slot.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule, // TODO(help-wanted): Can we import just specific pipe?
	],
})
export class HappeningSlotComponent {
	@Input({ required: true }) public happening?: IHappeningContext;
	@Input({ required: true }) public slot: IHappeningSlot = {
		id: '',
		repeats: 'UNKNOWN',
	};

	constructor(
		private readonly happeningSlotModalService: HappeningSlotModalService,
	) {}

	protected deleting = false;

	async editSingleHappeningSlot(event: Event): Promise<void> {
		if (!this.happening) {
			return Promise.reject('no happening');
		}
		await this.happeningSlotModalService.editSingleHappeningSlot(
			event,
			this.happening,
		);
	}
}
