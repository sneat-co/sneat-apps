import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IAssetBrief, IAssetDto, TeamCounter } from '@sneat/dto';
import { IAssetContext } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';
import { ICreateAssetRequest } from './asset-service.dto';

@Injectable({
	providedIn: 'root',
})
export class AssetService {
	private readonly sfs: SneatFirestoreService<IAssetBrief, IAssetDto>;

	constructor(
		private readonly teamItemBaseService: TeamItemBaseService,
	) {
		this.sfs = new SneatFirestoreService<IAssetBrief, IAssetDto>(
			'assets', teamItemBaseService.afs, (id: string, dto: IAssetDto) => {
				const brief: IAssetBrief = {
					id, ...dto,
				};
				return brief;
			},
		);
	}

	public deleteAsset(asset: IAssetContext): Observable<void> {
		if (!asset?.team?.id) {
			return throwError(() => 'team ID is not supplied');
		}
		const request = new HttpParams({ fromObject: { id: asset.id, team: asset.team.id } });
		return this.teamItemBaseService.sneatApiService
			.delete<void>('assets/delete_asset', request);
	}

	public createAsset(request: ICreateAssetRequest): Observable<IAssetContext> {
		console.log(`AssetService.createAsset()`, request);
		return this.teamItemBaseService.createTeamItem<IAssetBrief, IAssetDto>(
			'assets/create_asset', TeamCounter.assets, request);
	}

	watchAssetByID(id: string): Observable<IAssetContext> {
		return this.sfs.watchByID(id);
	}

	watchAssetsByTeamID<Dto extends IAssetDto>(teamID: string): Observable<IAssetContext<Dto>[]> {
		console.log('watchAssetsByTeamID()', teamID);
		return this.sfs.watchByTeamID<Dto>(teamID);
	}
}
