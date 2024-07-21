import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	ICalendarHappeningBrief,
	RepeatPeriod,
} from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/team-models';
import { getLiabilitiesByPeriod } from './budget-calc-periods';
import { LiabilitiesByPeriod, LiabilitiesMode } from './budget-component-types';
import { BudgetPeriodComponent } from './budget-period.component';

@Component({
	selector: 'sneat-budget-periods',
	templateUrl: './budget-periods.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, BudgetPeriodComponent],
})
export class BudgetPeriodsComponent implements OnChanges {
	@Input({ required: true }) space: ISpaceContext = { id: '' };
	@Input({ required: true }) recurringHappenings?: Record<
		string,
		ICalendarHappeningBrief
	>;
	@Input({ required: true }) liabilitiesMode: LiabilitiesMode = 'balance';

	@Input({ required: true }) activePeriod: RepeatPeriod = 'weekly';

	protected readonly periods: RepeatPeriod[] = [
		// 'daily',
		'weekly',
		'monthly',
		'yearly',
	];

	showBy: 'event' | 'contact' = 'event';

	@Output() readonly activePeriodChange = new EventEmitter<RepeatPeriod>();

	protected onPeriodChanged(event: Event): void {
		this.activePeriod = (event as CustomEvent).detail.value;
		this.activePeriodChange.emit(this.activePeriod);
	}

	protected readonly liabilitiesByPeriod = signal<LiabilitiesByPeriod>({});

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['recurringHappenings']) {
			this.updateLiabilitiesByPeriod(this.recurringHappenings);
		}
	}

	private updateLiabilitiesByPeriod(
		recurringHappenings?: Record<string, ICalendarHappeningBrief>,
	): void {
		console.log('updateHappeningLiabilitiesByPeriod()');
		if (!recurringHappenings) {
			this.liabilitiesByPeriod.set({});
			return;
		}

		const result = getLiabilitiesByPeriod(recurringHappenings, this.space);
		this.liabilitiesByPeriod.set(result);
	}
}
