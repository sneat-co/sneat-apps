import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'sneat-debtus-member-debts-summary',
	templateUrl: './member-debts-summary.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class MemberDebtsSummaryComponent {}
