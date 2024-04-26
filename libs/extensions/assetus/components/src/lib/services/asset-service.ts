import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { ITeamContext } from '@sneat/team-models';
import { ModuleTeamItemService } from '@sneat/team-services';
import { Observable } from 'rxjs';
import { ICreateAssetRequest, IUpdateAssetRequest } from './asset-service.dto';

@Injectable({
	providedIn: 'root',
})
export class AssetService extends ModuleTeamItemService<
	IAssetBrief,
	IAssetDboBase<string, IAssetExtra<string>>
> {
	constructor(afs: AngularFirestore, sneatApiService: SneatApiService) {
		super('assetus', 'assets', afs, sneatApiService);
	}

	public deleteAsset(teamID: string, assetID: string): Observable<void> {
		const request = new HttpParams({
			fromObject: { id: assetID, team: teamID },
		});
		return this.sneatApiService.delete<void>('assets/delete_asset', request);
	}

	public updateAsset(request: IUpdateAssetRequest): Observable<void> {
		return this.sneatApiService.post('assets/update_asset', request);
	}

	public createAsset<
		ExtraType extends AssetExtraType,
		Extra extends IAssetExtra<ExtraType>,
	>(
		team: ITeamContext,
		request: ICreateAssetRequest<ExtraType, Extra>,
	): Observable<IAssetContext<ExtraType, Extra>> {
		console.log(`AssetService.createAsset()`, request);
		request = { ...request, asset: { ...request.asset, isRequest: true } };
		return this.createTeamItem<IAssetBrief, IAssetDbo<ExtraType, Extra>>(
			'assets/create_asset?assetCategory=' + request.asset.category,
			team,
			request,
		);
	}

	public readonly watchAssetByID = this.watchTeamItemByIdWithTeamRef;

	watchTeamAssets<
		ExtraType extends AssetExtraType,
		Extra extends IAssetExtra<ExtraType>,
	>(
		team: ITeamContext,
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
		return this.watchModuleTeamItemsWithTeamRef<IAssetDbo<ExtraType, Extra>>(
			team,
			{
				filter,
			},
		);
	}
}
