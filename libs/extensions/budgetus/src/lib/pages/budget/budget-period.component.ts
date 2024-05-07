import { CommonModule } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IAmount, RepeatPeriod } from '@sneat/mod-schedulus-core';
import { IHappeningLiability } from './budget-components-types';

@Component({
	selector: 'sneat-budget-period',
	templateUrl: 'budget-period.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, FormsModule],
})
export class BudgetPeriodComponent {
	tab: 'by_event' | 'by_contact' = 'by_event';

	@Input({ required: true }) period?: RepeatPeriod;

	@Input({ required: true })
	happeningLiabilities?: readonly IHappeningLiability[];

	protected getAmounts(liability: IHappeningLiability): readonly IAmount[] {
		const result: IAmount[] = [];
		Object.entries(liability.valuesByCurrency).forEach(([currency, value]) => {
			result.push({ currency, value });
		});
		return result;
	}

	protected tabClicked(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
	}

	protected readonly encodeURI = encodeURI;
}
