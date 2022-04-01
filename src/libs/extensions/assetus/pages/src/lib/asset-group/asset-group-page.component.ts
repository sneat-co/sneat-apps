//tslint:disable:no-unsafe-any
import {Component, OnInit} from '@angular/core';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {IAssetGroupService, IAssetService} from 'sneat-shared/services/interfaces';
import {IAssetDtoGroup} from 'sneat-shared/models/dto/dto-asset';
import {Period} from 'sneat-shared/models/types';
import {Asset} from 'sneat-shared/models/ui/ui-asset';
import {AssetFactory} from 'sneat-shared/models/ui/ui-asset-factory';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {IRecord, RxRecordKey} from 'rxstore';

@Component({
	selector: 'sneat-asset-group',
	templateUrl: './asset-group-page.component.html',
	styleUrls: ['./asset-group-page.component.scss'],
	providers: [CommuneBasePageParams],
})
export class AssetGroupPageComponent extends CommuneBasePage implements OnInit {

	public period: Period = 'month';
	public assetGroup: IAssetDtoGroup | undefined;
	public assets: Asset[] | undefined;

	constructor(
		params: CommuneBasePageParams,
		private readonly assetGroupsService: IAssetGroupService,
		private readonly assetService: IAssetService,
		private readonly assetFactory: AssetFactory,
	) {
		super('budget', params);
		this.assetGroup = window.history.state.assetGroupDto as IAssetDtoGroup;
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.route.queryParams.subscribe(params => {
			const groupId = params.id;
			console.log('AssetGroupPage(): params=', params, 'groupId:', groupId);
			this.subscriptions.push(this.assetGroupsService.watchById(groupId)
				.subscribe(
					assetGroup => {
						console.log('AssetGroupPage(): watchAssetGroup=', groupId, assetGroup);
						this.assetGroup = assetGroup;
					},
					err => {
						console.error(err);
					},
				));
			this.subscriptions.push(this.assetService.assetsByGroupID(groupId)
				.subscribe(assets => {
					this.assets = assets && assets.map(a => this.assetFactory.newAsset(a)) || undefined;
				}));
		});
	}

	periodChanged(period: Period): void {
		this.period = period;
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
