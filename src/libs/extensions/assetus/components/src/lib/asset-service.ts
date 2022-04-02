import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { IAssetDto } from '@sneat/dto';
import { IAssetContext } from '@sneat/team/models';
import { map, Observable } from 'rxjs';
import { ICreateAssetRequest } from './asset-service.dto';

@Injectable({
	providedIn: 'root',
})
export class AssetService {
	constructor(
		private readonly db: AngularFirestore,
		private readonly sneatApiService: SneatApiService,
	) {
	}

	public createAsset(request: ICreateAssetRequest): Observable<IAssetContext> {
		console.log(`AssetService.createAsset()`, request);
		return this.sneatApiService
			.post<IAssetContext>('assets/create_asset', request);
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
