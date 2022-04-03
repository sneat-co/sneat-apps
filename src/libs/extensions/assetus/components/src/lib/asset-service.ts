import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { IAssetDto } from '@sneat/dto';
import { IAssetContext } from '@sneat/team/models';
import { TeamService } from '@sneat/team/services';
import { map, Observable, throwError } from 'rxjs';
import { ICreateAssetRequest } from './asset-service.dto';

@Injectable({
	providedIn: 'root',
})
export class AssetService {
	constructor(
		private readonly db: AngularFirestore,
		private readonly sneatApiService: SneatApiService,
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
		return this.sneatApiService
			.post<IAssetContext>('assets/create_asset', request).pipe(
				// tap(() => {
				// 	this.teamService.getTeam(request.team).subscribe({
				// 		next: team => {
				// 			if (team?.dto?.numberOf?.assets) {
				// 				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// 				// @ts-ignore
				// 				team?.dto?.numberOf?.assets += 1;
				// 			} else {
				// 				team = { ...team, dto: team.dto ? { ...team?.dto, numberOf: {assets: 1} } : team.dto };
				// 				this.teamService.onTeamUpdated(team);
				// 			}
				// 		},
				// 	});
				// }),
			);
	}

	watchAssetByID(id: string): Observable<IAssetContext> {
		return throwError(() => 'not implemented yet');
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
