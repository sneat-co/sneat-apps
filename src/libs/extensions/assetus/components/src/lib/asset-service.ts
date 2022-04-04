import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { IAssetBrief, IAssetDto, TeamCounter } from '@sneat/dto';
import { IAssetContext } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { map, Observable, throwError } from 'rxjs';
import { ICreateAssetRequest } from './asset-service.dto';

@Injectable({
	providedIn: 'root',
})
export class AssetService {
	constructor(
		private readonly db: AngularFirestore,
		private readonly sneatApiService: SneatApiService,
		private readonly teamItemService: TeamItemBaseService,
	) {
	}

	public deleteAsset(asset: IAssetContext): Observable<void> {
		if (!asset?.team?.id) {
			return throwError(() => 'team ID is not supplied');
		}
		const request = new HttpParams({ fromObject: { id: asset.id, team: asset.team.id } });
		return this.sneatApiService
			.delete<void>('assets/delete_asset', request);
	}

	public createAsset(request: ICreateAssetRequest): Observable<IAssetContext> {
		console.log(`AssetService.createAsset()`, request);
		return this.teamItemService.createTeamItem<IAssetBrief, IAssetDto>(
			'assets/create_asset', TeamCounter.assets, request);
	}

	watchAssetByID(id: string): Observable<IAssetContext> {
		return this.db
			.collection('team_assets')
			.doc<IAssetDto>(id)
			.snapshotChanges()
			.pipe(
				map(changes => {
					if (!changes.payload.exists) {
						return { id, dto: null };
					}
					const dto: IAssetDto = changes.payload.data();
					const asset: IAssetContext = { id, dto, brief: { id, ...dto } };
					return asset;
				}),
			);
	}

	watchAssetsByTeamID(teamID: string): Observable<IAssetContext[]> {
		console.log('watchAssetsByTeamID()', teamID);
		const query = this.db
			.collection<IAssetDto>('team_assets',
				ref => ref.where('teamIDs', 'array-contains', teamID));
		return query.get()
			.pipe(
				map(changes => {
					console.log('team_assets changes:', changes.docs);
					return changes.docs.map(d => {
						const dto = d.data();
						const { id } = d;
						const asset: IAssetContext = { id: d.id, team: { id: teamID }, brief: { id, ...dto }, dto };
						return asset;
					});
				}),
			);
	}
}
