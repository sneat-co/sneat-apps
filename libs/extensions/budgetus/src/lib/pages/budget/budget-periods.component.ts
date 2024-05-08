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
import { getHappeningLiabilitiesByPeriod } from './budget-calc-periods';
import {
	HappeningLiabilitiesByPeriod,
	LiabilitiesMode,
} from './budget-component-types';
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

	protected readonly happeningLiabilitiesByPeriod =
		signal<HappeningLiabilitiesByPeriod>({});

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['recurringHappenings']) {
			this.updateHappeningLiabilitiesByPeriod(this.recurringHappenings);
		}
	}

	private updateHappeningLiabilitiesByPeriod(
		recurringHappenings?: Record<string, ICalendarHappeningBrief>,
	): void {
		console.log('updateHappeningLiabilitiesByPeriod()');
		if (!recurringHappenings) {
			this.happeningLiabilitiesByPeriod.set({});
			return;
		}

		const result = getHappeningLiabilitiesByPeriod(
			recurringHappenings,
			this.team,
		);
		this.happeningLiabilitiesByPeriod.set(result);
	}
}
