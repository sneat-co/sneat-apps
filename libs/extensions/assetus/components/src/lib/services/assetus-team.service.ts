import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IAssetBrief, IAssetDtoBase, IAssetusTeamDto } from '@sneat/dto';
import { ITeamContext } from '@sneat/team-models';
import { TeamModuleService } from '@sneat/team-services';

@Injectable()
export class AssetusTeamService extends TeamModuleService<IAssetusTeamDto> {
	public constructor(afs: AngularFirestore) {
		super('assetus', afs);
	}

	readonly watchAssetBriefs = (team: ITeamContext) =>
		this.watchBriefs<IAssetBrief, IAssetDtoBase>(
			team,
			(dto) => dto?.assets || {},
		);
}
