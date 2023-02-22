import {Component} from '@angular/core';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {MemberBasePage} from '../member-base-page';
import {IAssetService, IMemberService} from 'sneat-shared/services/interfaces';
import {NgModulePreloaderService} from 'sneat-shared/services/ng-module-preloader.service';

@Component({
	selector: 'sneat-member-contacts',
	templateUrl: './member-contacts-page.component.html',
	providers: [CommuneBasePageParams],
})
export class MemberContactsPageComponent extends MemberBasePage {

	public override segment: 'friends' | 'other' = 'friends';

	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		preloader: NgModulePreloaderService,
		assetService: IAssetService,
	) {
		super(params, membersService, preloader, assetService);
	}
}
