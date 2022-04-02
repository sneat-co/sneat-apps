import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { IAssetContext } from '@sneat/team/models';
import { Observable } from 'rxjs';
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
}
