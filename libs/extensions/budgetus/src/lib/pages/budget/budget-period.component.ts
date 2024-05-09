import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IAmount, RepeatPeriod } from '@sneat/mod-schedulus-core';
import {
	IHappeningLiability,
	IPeriodLiabilities,
} from './budget-component-types';

@Component({
	selector: 'sneat-budget-period',
	templateUrl: 'budget-period.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetPeriodComponent implements OnChanges {
	tab: 'by_event' | 'by_contact' = 'by_event';

	@Input({ required: true }) period?: RepeatPeriod;
	@Input({ required: true }) showBy?: 'event' | 'contact' = 'event';

	@Input({ required: true })
	periodLiabilities?: IPeriodLiabilities;

	protected getAmounts(liability: IHappeningLiability): readonly IAmount[] {
		const result: IAmount[] = [];
		Object.entries(liability.valuesByCurrency).forEach(([currency, value]) => {
			result.push({ currency, value });
		});
		return result;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['periodLiabilities']) {
			console.log(
				'BudgetPeriodComponent.ngOnChanges: periodLiabilities:',
				this.periodLiabilities,
			);
		}
	}
}
