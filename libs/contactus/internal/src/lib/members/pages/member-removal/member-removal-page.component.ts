import { Component, inject } from '@angular/core';
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
	constructor() {
		const params = inject(CommuneBasePageParams);
		const membersService = inject(IMemberService);
		const preloader = inject(NgModulePreloaderService);
		const assetService = inject(IAssetService);

		super(params, membersService, preloader, assetService);
	}

	cancelMemberRemoval(): void {
		this.navCtrl.back();
	}

	removeMember(): void {
		this.errorLogger.logError(new Error('Not implemented yet'));
	}
}
