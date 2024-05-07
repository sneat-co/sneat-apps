import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Period } from '@sneat/dto';
import { LiabilitiesMode } from './budget-types';

@Component({
	selector: 'sneat-budget-periods',
	templateUrl: './budget-periods.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class BudgetPeriodsComponent {
	@Input({ required: true }) liabilitiesMode: LiabilitiesMode = 'balance';

	@Input({ required: true }) period: Period = 'week';
	@Output() readonly periodChange = new EventEmitter<Period>();

	protected onPeriodChanged(event: Event): void {
		this.period = (event as CustomEvent).detail.value;
		this.periodChange.emit(this.period);
	}
}
