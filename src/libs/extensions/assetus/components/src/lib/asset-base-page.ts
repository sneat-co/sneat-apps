import { ActivatedRoute } from '@angular/router';
import { IAssetBrief, IAssetDto } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends TeamItemBaseComponent<IAssetBrief, IAssetDto> {
	public asset?: IAssetContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		public readonly params: AssetComponentBaseParams,
		parentPagePath = 'assets',
	) {
		super(className, route, params.teamParams, parentPagePath, 'asset', (id: string) => params.assetService.watchAssetByID(id));
	}

	protected override setItemContext(item?: IAssetContext) {
		this.asset = item;
	}

	protected override get item(): IAssetContext | undefined {
		return this.asset;
	}

	protected override briefs(): IAssetBrief[] | undefined {
		return this.team?.dto?.assets;
	}

}
