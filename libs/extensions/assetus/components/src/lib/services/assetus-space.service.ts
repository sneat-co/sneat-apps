import { Injectable, Injector, inject } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IAssetBrief, IAssetusSpaceDbo } from '@sneat/mod-assetus-core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceModuleService } from '@sneat/space-services';

@Injectable()
export class AssetusSpaceService extends SpaceModuleService<IAssetusSpaceDbo> {
	public constructor() {
		const afs = inject(AngularFirestore);
		const injector = inject(Injector);
		super(injector, 'assetus', afs);
	}

	readonly watchAssetBriefs = (space: ISpaceContext) =>
		this.watchBriefs<IAssetBrief>(space.id, (dto) => dto?.assets || {});
}
