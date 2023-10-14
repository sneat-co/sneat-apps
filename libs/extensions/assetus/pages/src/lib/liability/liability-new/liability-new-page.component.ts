import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import {CommuneBasePageParams} from 'sneat-shared/services/params';
// import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';

@Component({
	selector: 'sneat-liability-new',
	templateUrl: './liability-new-page.component.html',
	// providers: [CommuneBasePageParams],
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule],
})
export class LiabilityNewPageComponent /*extends CommuneBasePage*/ {
	public liabilityType: 'income' | 'expense' = 'expense';
	public readonly assignedTo = 'members';
	public period: 'weekly' | 'monthly' | 'yearly' = 'monthly';

	constructor() { // params: CommuneBasePageParams
		// super('budget', params);
	}
}
