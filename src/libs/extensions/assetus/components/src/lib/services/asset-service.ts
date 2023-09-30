import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
	Firestore as AngularFirestore
} from "@angular/fire/firestore";
import { IFilter, SneatApiService } from "@sneat/api";
import { AssetCategory, IAssetBrief, IAssetDtoBase, IAssetMainData } from "@sneat/dto";
import { IAssetContext, ITeamContext } from "@sneat/team/models";
import { TeamItemService } from "@sneat/team/services";
import { Observable, throwError } from "rxjs";
import { ICreateAssetRequest } from "../asset-service.dto";

@Injectable({
	providedIn: "root"
})
export class AssetService extends TeamItemService<IAssetBrief, IAssetDtoBase> {
	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService
	) {
		super("assetus", "assets", afs, sneatApiService);
	}

	public deleteAsset(asset: IAssetContext): Observable<void> {
		if (!asset?.team?.id) {
			return throwError(() => "team ID is not supplied");
		}
		const request = new HttpParams({ fromObject: { id: asset.id, team: asset.team.id } });
		return this.sneatApiService.delete<void>("assets/delete_asset", request);
	}

	public createAsset<A extends IAssetMainData, D extends IAssetDtoBase>(team: ITeamContext, request: ICreateAssetRequest<A>): Observable<IAssetContext<D>> {
		console.log(`AssetService.createAsset()`, request);
		request = { ...request, asset: { ...request.asset, isRequest: true } };
		return this.createTeamItem<IAssetBrief, D>("assets/create_asset?assetCategory=" + request.asset.category, team, request);
	}

	public readonly watchAssetByID = this.watchTeamItemByID;

	watchTeamAssets<Brief extends IAssetBrief, Dto extends IAssetDtoBase>(
		team: ITeamContext,
		category?: AssetCategory
	): Observable<IAssetContext<Dto>[]> {
		// console.log('watchAssetsByTeamID()', team.id);
		const filter: IFilter[] | undefined = category ? [{
			field: "category",
			operator: "==",
			value: category
		}] : undefined;
		return this.watchModuleTeamItems<Brief, Dto>("assetus", team, filter);
	}
}
