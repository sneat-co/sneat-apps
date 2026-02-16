import { HttpParams } from '@angular/common/http';
import { Injectable, inject, Injector } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import {
  AssetCategory,
  IAssetBrief,
  IAssetDboBase,
  IAssetContext,
  IAssetDbo,
  AssetExtraType,
  IAssetExtra,
} from '@sneat/mod-assetus-core';
import { ISpaceContext } from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
import { Observable } from 'rxjs';
import {
  IAddVehicleRecordRequest,
  ICreateAssetRequest,
  IUpdateAssetRequest,
} from './asset-service.dto';

@Injectable()
export class AssetService extends ModuleSpaceItemService<
  IAssetBrief<string>,
  IAssetDboBase<string>
> {
  constructor() {
    const afs = inject(AngularFirestore);
    const sneatApiService = inject(SneatApiService);
    const injector = inject(Injector);
    super(injector, 'assetus', 'assets', afs, sneatApiService);
  }

  public deleteAsset(spaceID: string, assetID: string): Observable<void> {
    const request = new HttpParams({
      fromObject: { id: assetID, space: spaceID },
    });
    return this.sneatApiService.delete<void>('assets/delete_asset', request);
  }

  public updateAsset(request: IUpdateAssetRequest): Observable<void> {
    return this.sneatApiService.post('assets/update_asset', request);
  }

  public createAsset<
    ExtraType extends AssetExtraType,
    Extra extends IAssetExtra,
  >(
    space: ISpaceContext,
    request: ICreateAssetRequest<ExtraType, Extra>,
  ): Observable<IAssetContext<ExtraType, Extra>> {
    // console.log(`AssetService.createAsset()`, request);
    request = { ...request, asset: { ...request.asset, isRequest: true } };
    return this.createSpaceItem<
      IAssetBrief<ExtraType, Extra>,
      IAssetDbo<ExtraType, Extra>
    >(
      'assets/create_asset?assetCategory=' + request.asset.category,
      space,
      request,
    );
  }

  public addVehicleRecord(request: IAddVehicleRecordRequest): Observable<void> {
    return this.sneatApiService.post('assets/add_vehicle_record', request);
  }

  public updateVehicleRecord(
    request: IAddVehicleRecordRequest,
  ): Observable<void> {
    return this.sneatApiService.post('assets/update_vehicle_record', request);
  }

  public deleteVehicleRecord(
    request: IAddVehicleRecordRequest,
  ): Observable<void> {
    return this.sneatApiService.post('assets/delete_vehicle_record', request);
  }

  public readonly watchAssetByID = this.watchSpaceItemByIdWithSpaceRef;

  public watchSpaceAssets<
    ExtraType extends AssetExtraType,
    Extra extends IAssetExtra,
  >(
    space: ISpaceContext,
    category?: AssetCategory,
  ): Observable<IAssetContext<ExtraType, Extra>[]> {
    // console.log('watchAssetsByTeamID()', team.id);
    const filter: IFilter[] | undefined = category
      ? [
          {
            field: 'category',
            operator: '==',
            value: category,
          },
        ]
      : undefined;
    return this.watchModuleSpaceItemsWithSpaceRef<IAssetDbo<ExtraType, Extra>>(
      space,
      {
        filter,
      },
    ) as Observable<IAssetContext<ExtraType, Extra>[]>;
  }
}
