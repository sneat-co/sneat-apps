import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IAssetBrief, IAssetusTeamDto } from '@sneat/mod-assetus-core';
import { ITeamContext } from '@sneat/team-models';
import { TeamModuleService } from '@sneat/team-services';

@Injectable()
export class AssetusTeamService extends TeamModuleService<IAssetusTeamDto> {
	public constructor(afs: AngularFirestore) {
		super('assetus', afs);
	}

	readonly watchAssetBriefs = (team: ITeamContext) =>
		this.watchBriefs<IAssetBrief>(team.id, (dto) => dto?.assets || {});
}
