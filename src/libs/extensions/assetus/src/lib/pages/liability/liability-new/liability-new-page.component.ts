import {Component} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';

@Component({
	selector: 'app-liability-new',
	templateUrl: './liability-new-page.component.html',
	providers: [CommuneBasePageParams],
})
export class LiabilityNewPageComponent extends CommuneBasePage {

	public liabilityType: 'income' | 'expense' = 'expense';
	public assignedTo: 'members' = 'members';
	public period: 'weekly' | 'monthly' | 'yearly' = 'monthly';

	constructor(
		params: CommuneBasePageParams
	) {
		super('budget', params);
	}
}
