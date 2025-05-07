import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonAccordion,
	IonButton,
	IonButtons,
	IonItem,
	IonLabel,
	IonList,
} from '@ionic/angular/standalone';
import { Decimal64p2Pipe } from '@sneat/components';
import { IAmount, RepeatPeriod, ShowBy } from '@sneat/mod-schedulus-core';
import {
	ILiabilityBase,
	IPeriodLiabilities,
	LiabilitiesByPeriod,
	LiabilitiesMode,
} from './budget-component-types';

@Component({
	selector: 'sneat-budget-period',
	templateUrl: 'budget-period.component.html',
	styleUrl: './budget-period.component.scss',
	imports: [
		FormsModule,
		Decimal64p2Pipe,
		IonAccordion,
		IonItem,
		IonLabel,
		TitleCasePipe,
		IonButtons,
		IonButton,
		CurrencyPipe,
		IonList,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetPeriodComponent implements OnChanges {
	tab: 'by_event' | 'by_contact' = 'by_event';

	@Input({ required: true }) activePeriod?: RepeatPeriod;
	@Input({ required: true }) period?: RepeatPeriod;
	@Input({ required: true }) showBy?: ShowBy = 'event';
	@Input({ required: true }) liabilitiesMode: LiabilitiesMode = 'balance';
	@Input({ required: true }) liabilitiesByPeriod?: LiabilitiesByPeriod;

	@Output() readonly showByChange = new EventEmitter<ShowBy>();

	protected periodLiabilities?: IPeriodLiabilities;

	protected readonly totalToBePaid = signal<IAmount[]>([]);

	protected getAmounts(liability: ILiabilityBase): readonly IAmount[] {
		const result: IAmount[] = [];
		Object.entries(liability.valuesByCurrency).forEach(([currency, value]) => {
			result.push({ currency, value });
		});
		return result;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('BudgetPeriodComponent.ngOnChanges()', this.period, changes);
		if (changes['liabilitiesByPeriod'] || changes['period']) {
			this.periodLiabilities = this.period
				? this.liabilitiesByPeriod?.[this.period]
				: undefined;
			if (this.periodLiabilities) {
				const total: IAmount[] = [];
				this.periodLiabilities.happenings.forEach((h) => {
					Object.entries(h.valuesByCurrency).forEach(([currency, value]) => {
						const i = total.findIndex((t) => t.currency === currency);
						if (i >= 0) {
							total[i] = { currency, value: total[i].value + value };
						} else {
							total.push({ currency, value });
						}
					});
				});
				this.totalToBePaid.set(total);
			}
		}
	}

	protected changeShowBy(showBy: 'event' | 'contact', event: Event): boolean {
		event.stopPropagation();
		event.preventDefault();
		this.showBy = showBy;
		// this.showByChange.emit(showBy);
		return false;
	}
}
