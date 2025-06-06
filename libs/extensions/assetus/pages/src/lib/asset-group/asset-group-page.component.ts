import { Component, OnInit, inject } from '@angular/core';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { Period } from '@sneat/dto';
import {
	AssetCardComponent,
	PeriodSegmentComponent,
} from '@sneat/ext-assetus-components';
import { IAssetContext, IAssetDtoGroup } from '@sneat/mod-assetus-core';
import {
	SpaceComponentBaseParams,
	SpacePageBaseComponent,
} from '@sneat/space-components';

// interface IAssetGroupService {
// 	watchById(id: string): Observable<IAssetDtoGroup>;
// }
//
// interface IAssetService {
// 	assetsByGroupID(groupID: string): Observable<IAssetContext[]>;
// }

class AssetFactory {
	newAsset(asset: IAssetContext): IAssetContext {
		return asset;
	}
}

@Component({
	selector: 'sneat-asset-group',
	templateUrl: './asset-group-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		PeriodSegmentComponent,
		AssetCardComponent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonButton,
		IonIcon,
		IonLabel,
		IonContent,
	],
})
export class AssetGroupPageComponent
	extends SpacePageBaseComponent
	implements OnInit
{
	private readonly assetGroupsService = inject(IAssetGroupService);
	private readonly assetService = inject(IAssetService);
	private readonly assetFactory = inject(AssetFactory);

	public period: Period = 'month';
	public assetGroup?: IAssetDtoGroup;
	public assets?: IAssetContext[];

	constructor() {
		super('AssetGroupPageComponent');
		this.assetGroup = window.history.state.assetGroupDto as IAssetDtoGroup;
	}

	override ngOnInit(): void {
		super.ngOnInit();
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
