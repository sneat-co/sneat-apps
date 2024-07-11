import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IAssetBrief, IAssetusSpaceDbo } from '@sneat/mod-assetus-core';
import { ISpaceContext } from '@sneat/team-models';
import { TeamModuleService } from '@sneat/team-services';

@Injectable()
export class AssetusTeamService extends TeamModuleService<IAssetusSpaceDbo> {
	public constructor(afs: AngularFirestore) {
		super('assetus', afs);
	}

	readonly watchAssetBriefs = (team: ISpaceContext) =>
		this.watchBriefs<IAssetBrief>(team.id, (dto) => dto?.assets || {});
}
