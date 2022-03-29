import {Component} from '@angular/core';
import {MemberBasePage} from '../member-base-page';
import {NgModulePreloaderService} from 'sneat-shared/services/ng-module-preloader.service';
import {IAssetService, IMemberService} from 'sneat-shared/services/interfaces';
import {CommuneBasePageParams} from 'sneat-shared/services/params';

@Component({
	selector: 'app-member-budget',
	templateUrl: './member-budget-page.component.html',
	providers: [CommuneBasePageParams],
})
export class MemberBudgetPageComponent extends MemberBasePage {

	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		preloader: NgModulePreloaderService,
		assetService: IAssetService,
	) {
		super(params, membersService, preloader, assetService);
	}
}
