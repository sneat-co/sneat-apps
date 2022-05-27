import { ActivatedRoute, ParamMap } from '@angular/router';
import { IAssetBrief, IAssetDto } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IAssetContext } from '@sneat/team/models';
import { Observable, throwError } from 'rxjs';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends TeamItemBaseComponent<IAssetBrief, IAssetDto> {
	public asset?: IAssetContext;

	protected readonly assetService = this.params.assetService;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		public readonly params: AssetComponentBaseParams,
		parentPagePath = 'assets',
	) {
		super(className, route, params.teamParams, parentPagePath, 'asset');
	}

	protected onRouteParamsChanged(params: ParamMap, itemID?: string, teamID?: string): void {
		// Nothing to do
	}

	protected override watchItemChanges(): Observable<IAssetContext> {
		if (!this.asset?.id) {
			return throwError(() => new Error('no asset context'));
		}
		return this.assetService.watchAssetByID(this.asset.id);
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
