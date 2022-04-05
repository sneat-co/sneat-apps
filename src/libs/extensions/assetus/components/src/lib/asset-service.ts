import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { INavContext } from '@sneat/core';
import { IAssetBrief, IAssetDto, TeamCounter } from '@sneat/dto';
import { IAssetContext } from '@sneat/team/models';
import { TeamItemBaseService, TeamService } from '@sneat/team/services';
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
		private readonly teamService: TeamService,
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

	watchAssetsByTeamID<Dto extends IAssetDto, T extends IAssetContext<Dto>>(teamID: string): Observable<T[]> {
		console.log('watchAssetsByTeamID()', teamID);
		const query = this.db
			.collection<Dto>('team_assets',
				ref => ref.where('teamIDs', 'array-contains', teamID));
		return query.get()
			.pipe(
				map(changes => {
					console.log('team_assets changes:', changes.docs);
					const assets: T[] = changes.docs.map(d => {
						const dto: Dto = d.data();
						const { id } = d;
						const brief: IAssetBrief = { id, ...dto };
						const asset: T = { id: d.id, team: { id: teamID }, brief, dto } as T;
						return asset;
					});
					this.teamService.getTeam(teamID).subscribe({
						next: team => {
							this.teamService.onTeamUpdated({
								...team,
								assets,
							});
						},
					});
					return assets;
				}),
			);
	}
}
