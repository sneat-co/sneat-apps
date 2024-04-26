import { ActivatedRoute, ParamMap } from '@angular/router';
import {
	IAssetBrief,
	IAssetDboBase,
	IAssetusTeamContext,
	IAssetContext,
	IAssetVehicleExtra,
	IAssetVehicleContext,
} from '@sneat/mod-assetus-core';
import { TeamItemPageBaseComponent } from '@sneat/team-components';
import { NEVER, Observable, throwError } from 'rxjs';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends TeamItemPageBaseComponent<
	IAssetBrief,
	IAssetDboBase
> {
	protected assetusTeam?: IAssetusTeamContext;

	protected asset?: IAssetContext;

	protected get vehicleAsset(): IAssetVehicleContext {
		return this.asset as IAssetVehicleContext;
	}

	protected readonly assetService = this.params.assetService;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		public readonly params: AssetComponentBaseParams,
		parentPagePath = 'assets',
	) {
		super(
			className,
			route,
			params.teamParams,
			parentPagePath,
			'asset',
			params.assetService,
		);
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
		console.log('AssetBasePage/setItemContext', item);
		super.setItemContext(item);
		this.asset = item;
	}

	protected override briefs(): Record<string, IAssetBrief> | undefined {
		return this.assetusTeam?.dto?.assets;
	}
}
