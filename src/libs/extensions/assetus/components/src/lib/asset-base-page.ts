import { ActivatedRoute, ParamMap } from '@angular/router';
import { IAssetBrief, IAssetDtoBase, IAssetusTeamContext } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IAssetContext, IVehicleAssetContext } from '@sneat/team/models';
import { NEVER, Observable, throwError } from 'rxjs';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends TeamItemBaseComponent<IAssetBrief, IAssetDtoBase> {

	protected assetusTeam?: IAssetusTeamContext;

	protected asset?: IAssetContext;

	protected get vehicleAsset(): IVehicleAssetContext {
		return this.asset as IVehicleAssetContext;
	}

	protected readonly assetService = this.params.assetService;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		public readonly params: AssetComponentBaseParams,
		parentPagePath = 'assets',
	) {
		super(className, route, params.teamParams, parentPagePath, 'asset', params.assetService);
	}

	protected onRouteParamsChanged(params: ParamMap, itemID?: string, teamID?: string): void {
		// Nothing to do
		console.log('onRouteParamsChanged', params, itemID, teamID);
	}

	protected override watchItemChanges(): Observable<IAssetContext> {
		if (!this.asset?.id) {
			return throwError(() => new Error('no asset context'));
		}
		const team = this.team;
		if (!team) {
			return NEVER;
		}
		return this.assetService.watchAssetByID(team, this.asset.id);
	}

	protected override setItemContext(item?: IAssetContext) {
		console.log('AssetBasePage/setItemContext', item)
		super.setItemContext(item)
		this.asset = item;
	}

	protected override briefs(): { [id: string]: IAssetBrief } | undefined {
		return this.assetusTeam?.dto?.assets;
	}
}
