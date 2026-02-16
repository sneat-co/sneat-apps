import {
  IAssetBrief,
  IAssetDboBase,
  IAssetusSpaceContext,
  IAssetContext,
  IAssetVehicleContext,
} from '@sneat/mod-assetus-core';
import { SpaceItemPageBaseComponent } from '@sneat/space-components';
import { NEVER, Observable, throwError } from 'rxjs';
import { AssetComponentBaseParams } from './asset-component-base-params';

export abstract class AssetBasePage extends SpaceItemPageBaseComponent<
  IAssetBrief,
  IAssetDboBase
> {
  protected assetusSpace?: IAssetusSpaceContext;

  protected asset?: IAssetContext;

  protected get vehicleAsset(): IAssetVehicleContext {
    return this.asset as IAssetVehicleContext;
  }

  protected readonly assetService = this.params.assetService;

  protected constructor(
    public readonly params: AssetComponentBaseParams,
    parentPagePath = 'assets',
  ) {
    super(parentPagePath, 'asset', params.assetService);
  }

  protected override watchItemChanges(): Observable<IAssetContext> {
    if (!this.asset?.id) {
      return throwError(() => new Error('no asset context'));
    }
    const space = this.space;
    if (!space) {
      return NEVER;
    }
    return this.assetService.watchAssetByID(space, this.asset.id);
  }

  protected override setItemContext(item?: IAssetContext) {
    super.setItemContext(item);
    this.asset = item;
  }

  protected override briefs(): Record<string, IAssetBrief> | undefined {
    return this.assetusSpace?.dbo?.assets;
  }
}
