import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	Firestore as AngularFirestore,
} from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { AssetCategory, IAssetBrief, IAssetDbData, IAssetMainData } from '@sneat/dto';
import { IAssetContext, ITeamContext } from '@sneat/team/models';
import { TeamItemService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';
import { ICreateAssetRequest } from './asset-service.dto';

@Injectable({
	providedIn: 'root',
})
export class AssetService {
	private readonly teamItemService: TeamItemService<IAssetBrief, IAssetDbData>;

	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService('assetus', 'assets', afs, sneatApiService);
	}

	public deleteAsset(asset: IAssetContext): Observable<void> {
		if (!asset?.team?.id) {
			return throwError(() => 'team ID is not supplied');
		}
		const request = new HttpParams({ fromObject: { id: asset.id, team: asset.team.id } });
		return this.teamItemService.sneatApiService
			.delete<void>('assets/delete_asset', request);
	}

	public createAsset<A extends IAssetMainData, D extends IAssetDbData>(team: ITeamContext, request: ICreateAssetRequest<A>): Observable<IAssetContext<D>> {
		console.log(`AssetService.createAsset()`, request);
		request = { ...request, asset: { ...request.asset, isRequest: true } };
		const result = this.teamItemService.createTeamItem<IAssetBrief, D>(
			'assets/create_asset?assetCategory=' + request.asset.category, team, request);
		return result;
	}


	watchAssetByID(team: ITeamContext, id: string): Observable<IAssetContext> {
		return this.teamItemService.watchTeamItemByID(team, id);
	}

	watchTeamAssets<Brief extends IAssetBrief, Dto extends IAssetDbData>(
		team: ITeamContext,
		category?: AssetCategory,
	): Observable<IAssetContext<Dto>[]> {
		// console.log('watchAssetsByTeamID()', team.id);
		const filter: IFilter[] | undefined = category ? [{
			field: 'category',
			operator: '==',
			value: category,
		}] : undefined;
		return this.teamItemService.watchModuleTeamItems<Brief, Dto>('assetus', team, filter);
	}
}
