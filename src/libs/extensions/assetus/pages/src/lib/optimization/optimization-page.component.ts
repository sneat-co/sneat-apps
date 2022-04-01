import {Component} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {CommuneTopPage} from '../../../../pages/constants';

@Component({
	selector: 'sneat-optimization',
	templateUrl: './optimization-page.component.html',
	providers: [CommuneBasePageParams],
})
export class OptimizationPageComponent extends CommuneBasePage {
	constructor(
		params: CommuneBasePageParams,
	) {
		super(CommuneTopPage.home, params);
	}
}
