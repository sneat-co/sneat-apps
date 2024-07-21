import {
	collection,
	CollectionReference,
	Firestore as AngularFirestore,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IIdAndBrief, IIdAndOptionalDbo } from '@sneat/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleSpaceItemService } from './space-item.service';

// import firebase from "firebase/compat";
// import Item = firebase.analytics.Item;

export abstract class SpaceModuleService<Dto> extends ModuleSpaceItemService<
	Dto,
	Dto
> {
	// protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	protected constructor(moduleID: string, afs: AngularFirestore) {
		// this.sfs = new SneatFirestoreService<Brief, Dto>(collectionName, afs);
		super(moduleID, 'modules', afs, undefined as unknown as SneatApiService);
	}

	watchSpaceModuleRecord(spaceID: string): Observable<IIdAndOptionalDbo<Dto>> {
		const logPrefix = `watchTeamModuleEntry(teamID=${spaceID}, moduleID=${this.moduleID})`;
		console.log(logPrefix);
		const collectionRef = collection(
			this.spacesCollection,
			spaceID,
			'modules',
		) as CollectionReference<Dto>;
		return this.sfs
			.watchByID<Dto>(collectionRef, this.moduleID)
			.pipe
			// tap((o) => console.log(`${logPrefix} =>`, o)),
			();
	}

	watchBriefs<ItemBrief>(
		spaceID: string,
		getBriefs: (dto?: Dto) => Readonly<Record<string, ItemBrief>>,
	): Observable<IIdAndBrief<ItemBrief>[]> {
		const o = this.watchSpaceModuleRecord(spaceID);
		return o.pipe(
			map((teamModule) => {
				const briefs = getBriefs(teamModule?.dbo || undefined);
				const items: IIdAndBrief<ItemBrief>[] = briefs
					? Object.keys(briefs).map((id) => ({ id, brief: briefs[id] }))
					: [];
				return items;
			}),
		);
	}
}
