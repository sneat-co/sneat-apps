import { Component } from '@angular/core';
import { MemberBasePage } from '../member-base-page';
import { CommuneBasePageParams } from 'sneat-shared/services/params';
import {
	IAssetService,
	IMemberService,
} from 'sneat-shared/services/interfaces';
import { NgModulePreloaderService } from 'sneat-shared/services/ng-module-preloader.service';

@Component({
	selector: 'sneat-member-removal',
	templateUrl: './member-removal-page.component.html',
	providers: [CommuneBasePageParams],
})
export class MemberRemovalPageComponent extends MemberBasePage {
	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		preloader: NgModulePreloaderService,
		assetService: IAssetService,
	) {
		super(params, membersService, preloader, assetService);
	}

	cancelMemberRemoval(): void {
		this.navCtrl.back();
	}

	removeMember(): void {
		this.errorLogger.logError(new Error('Not implemented yet'));
	}
}
