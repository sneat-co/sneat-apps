import {
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	Output,
	signal,
} from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular/standalone';
import {
	ICalendarHappeningBrief,
	RepeatPeriod,
	ShowBy,
} from '@sneat/mod-schedulus-core';
import { WithSpaceInput } from '@sneat/space-services';
import { getLiabilitiesByPeriod } from './budget-calc-periods';
import { LiabilitiesByPeriod, LiabilitiesMode } from './budget-component-types';
import { BudgetPeriodComponent } from './budget-period.component';

@Component({
	selector: 'sneat-budget-periods',
	templateUrl: './budget-periods.component.html',
	imports: [BudgetPeriodComponent, IonAccordionGroup],
})
export class BudgetPeriodsComponent extends WithSpaceInput {
	public readonly $recurringHappenings = input.required<
		undefined | Readonly<Record<string, ICalendarHappeningBrief>>
	>();

	public readonly $liabilitiesMode = input.required<LiabilitiesMode>();

	@Input({ required: true }) activePeriod: RepeatPeriod = 'weekly';

	protected readonly periods: RepeatPeriod[] = [
		// 'daily',
		'weekly',
		'monthly',
		'yearly',
	];

	protected readonly $showBy = signal<ShowBy>('event');

	@Output() readonly activePeriodChange = new EventEmitter<RepeatPeriod>();

	constructor() {
		super('BudgetPeriodsComponent');
	}

	protected onPeriodChanged(event: Event): void {
		this.activePeriod = (event as CustomEvent).detail.value;
		this.activePeriodChange.emit(this.activePeriod);
	}

	protected readonly $liabilitiesByPeriod = computed<LiabilitiesByPeriod>(
		() => {
			const recurringHappenings = this.$recurringHappenings();
			if (!recurringHappenings) {
				return {};
			}
			const lbp = getLiabilitiesByPeriod(
				this.$liabilitiesMode(),
				recurringHappenings,
				this.$space(),
			);
			console.log('BudgetPeriodsComponent: lbp', lbp);
			return lbp;
		},
	);
}
