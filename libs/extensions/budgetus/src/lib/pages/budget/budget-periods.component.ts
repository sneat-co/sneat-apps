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
import { Period } from '@sneat/dto';
import {
	ICalendarHappeningBrief,
	RepeatPeriod,
} from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
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
	@Input({ required: true }) team: ITeamContext = { id: '' };
	@Input({ required: true }) recurringHappenings?: Record<
		string,
		ICalendarHappeningBrief
	>;
	@Input({ required: true }) liabilitiesMode: LiabilitiesMode = 'balance';

	@Input({ required: true }) period: RepeatPeriod = 'weekly';

	@Output() readonly periodChange = new EventEmitter<RepeatPeriod>();

	protected onPeriodChanged(event: Event): void {
		this.period = (event as CustomEvent).detail.value;
		this.periodChange.emit(this.period);
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

		const result = getLiabilitiesByPeriod(recurringHappenings, this.team);
		this.liabilitiesByPeriod.set(result);
	}
}
