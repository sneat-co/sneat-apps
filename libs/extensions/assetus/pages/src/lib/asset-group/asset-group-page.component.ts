import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Period } from '@sneat/dto';
import { IAssetContext, IAssetDtoGroup } from '@sneat/mod-assetus-core';
import {
	TeamComponentBaseParams,
	TeamPageBaseComponent,
} from '@sneat/team-components';
import { Observable } from 'rxjs';

interface IAssetGroupService {
	watchById(id: string): Observable<IAssetDtoGroup>;
}

interface IAssetService {
	assetsByGroupID(groupID: string): Observable<IAssetContext[]>;
}

class AssetFactory {
	newAsset(asset: IAssetContext): IAssetContext {
		return asset;
	}
}

@Component({
	selector: 'sneat-asset-group',
	templateUrl: './asset-group-page.component.html',
	providers: [TeamComponentBaseParams],
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class AssetGroupPageComponent
	extends TeamPageBaseComponent
	implements OnInit
{
	public period: Period = 'month';
	public assetGroup?: IAssetDtoGroup;
	public assets?: IAssetContext[];

	constructor(
		params: TeamComponentBaseParams,
		route: ActivatedRoute,
		private readonly assetGroupsService: IAssetGroupService,
		private readonly assetService: IAssetService,
		private readonly assetFactory: AssetFactory,
	) {
		super('AssetGroupPageComponent', route, params);
		this.assetGroup = window.history.state.assetGroupDto as IAssetDtoGroup;
	}

	ngOnInit(): void {
		// super.ngOnInit();
		this.route.queryParams.subscribe((params) => {
			const groupId = params['id'] as string | undefined;
			console.log('AssetGroupPage(): params=', params, 'groupId:', groupId);
			if (!groupId) {
				return;
			}
			this.subs.add(
				this.assetGroupsService.watchById(groupId).subscribe({
					next: (assetGroup: IAssetDtoGroup) => {
						console.log(
							'AssetGroupPage(): watchAssetGroup=',
							groupId,
							assetGroup,
						);
						this.assetGroup = assetGroup;
					},
					error: (err: unknown) => {
						console.error(err);
					},
				}),
			);
			this.subs.add(
				this.assetService.assetsByGroupID(groupId).subscribe((assets) => {
					this.assets =
						(assets && assets.map((a) => this.assetFactory.newAsset(a))) ||
						undefined;
				}),
			);
		});
	}

	periodChanged(period: Period): void {
		this.period = period;
	}
}
