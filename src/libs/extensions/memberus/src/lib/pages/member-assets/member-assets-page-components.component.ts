import {Component} from '@angular/core';
import {MemberBasePage} from '../member-base-page';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IAssetService, IMemberService} from 'sneat-shared/services/interfaces';

@Component({
	selector: 'sneat-member-assets',
	templateUrl: './member-assets-page-components.component.html',
	providers: [CommuneBasePageParams],
})
export class MemberAssetsPageComponent extends MemberBasePage {

	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		// preloader: NgModulePreloaderService,
		assetService: IAssetService,
	) {
		super(params, membersService, preloader, assetService);
	}
}
