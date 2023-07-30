import { ActivatedRoute, ParamMap } from '@angular/router';
import { IAssetBrief, IAssetDto } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IAssetContext, IVehicleAssetContext } from '@sneat/team/models';
import { NEVER, Observable, throwError } from 'rxjs';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends TeamItemBaseComponent<IAssetBrief, IAssetDto> {

	protected asset?: IAssetContext;

	protected get vehicleAsset(): IVehicleAssetContext {
		return this.asset as IVehicleAssetContext
	}

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
		this.asset = item;
	}

	protected override get item(): IAssetContext | undefined {
		return this.asset;
	}

	protected override briefs(): IAssetBrief[] | undefined {
		return this.team?.dto?.assets;
	}

}
