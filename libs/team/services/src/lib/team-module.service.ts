import {
	collection,
	CollectionReference,
	Firestore as AngularFirestore,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IIdAndBrief, IIdAndOptionalDto } from '@sneat/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleTeamItemService } from './team-item.service';

// import firebase from "firebase/compat";
// import Item = firebase.analytics.Item;

export abstract class TeamModuleService<Dto> extends ModuleTeamItemService<
	Dto,
	Dto
> {
	// protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	protected constructor(moduleID: string, afs: AngularFirestore) {
		// this.sfs = new SneatFirestoreService<Brief, Dto>(collectionName, afs);
		super(moduleID, 'modules', afs, undefined as unknown as SneatApiService);
	}

	watchTeamModuleRecord(teamID: string): Observable<IIdAndOptionalDto<Dto>> {
		const logPrefix = `watchTeamModuleEntry(teamID=${teamID}, moduleID=${this.moduleID})`;
		console.log(logPrefix);
		const collectionRef = collection(
			this.teamsCollection,
			teamID,
			'modules',
		) as CollectionReference<Dto>;
		return this.sfs
			.watchByID<Dto>(collectionRef, this.moduleID)
			.pipe
			// tap((o) => console.log(`${logPrefix} =>`, o)),
			();
	}

	watchBriefs<ItemBrief>(
		teamID: string,
		getBriefs: (dto?: Dto) => Readonly<{
			[id: string]: ItemBrief;
		}>,
	): Observable<IIdAndBrief<ItemBrief>[]> {
		const o = this.watchTeamModuleRecord(teamID);
		return o.pipe(
			map((teamModule) => {
				const briefs = getBriefs(teamModule?.dto || undefined);
				const items: IIdAndBrief<ItemBrief>[] = briefs
					? Object.keys(briefs).map((id) => ({ id, brief: briefs[id] }))
					: [];
				return items;
			}),
		);
	}
}
