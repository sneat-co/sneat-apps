import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ScheduleModalsService } from '../../services';
import { IHappeningContext, IHappeningSlot } from '@sneat/mod-schedulus-core';

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
		start: { time: '' },
	};

	constructor(private readonly scheduleModalsService: ScheduleModalsService) {}

	protected deleting = false;

	async editSingleHappeningSlot(event: Event): Promise<void> {
		if (!this.happening) {
			return Promise.reject('no happening');
		}
		await this.scheduleModalsService.editSingleHappeningSlot(
			event,
			this.happening,
		);
	}
}
