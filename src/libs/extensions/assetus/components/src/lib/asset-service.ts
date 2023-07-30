import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	Firestore as AngularFirestore,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IAssetBrief, IAssetDbData } from '@sneat/dto';
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
		this.teamItemService = new TeamItemService<IAssetBrief, IAssetDbData>(
			'assets', afs, sneatApiService,
		);
	}

	public deleteAsset(asset: IAssetContext): Observable<void> {
		if (!asset?.team?.id) {
			return throwError(() => 'team ID is not supplied');
		}
		const request = new HttpParams({ fromObject: { id: asset.id, team: asset.team.id } });
		return this.teamItemService.sneatApiService
			.delete<void>('assets/delete_asset', request);
	}

	public createAsset(team: ITeamContext, request: ICreateAssetRequest): Observable<IAssetContext> {
		console.log(`AssetService.createAsset()`, request);
		request = { ...request, asset: { ...request.asset, isRequest: true } };
		return this.teamItemService.createTeamItem<IAssetBrief, IAssetDbData>(
			'assets/create_asset?assetCategory=' + request.asset.category, team, request);
	}

	watchAssetByID(team: ITeamContext, id: string): Observable<IAssetContext> {
		return this.teamItemService.watchTeamItemByID(team, id);
	}

	watchTeamAssets<Brief extends IAssetBrief, Dto extends IAssetDbData>(team: ITeamContext): Observable<IAssetContext<Dto>[]> {
		// console.log('watchAssetsByTeamID()', team.id);
		return this.teamItemService.watchModuleTeamItems<Brief, Dto>('assetus', team);
	}
}
