import { collection, CollectionReference, Firestore as AngularFirestore } from "@angular/fire/firestore";
import { SneatApiService } from "@sneat/api";
import { IContactBrief } from "@sneat/dto";
import { IDtoAndID, ITeamContext, ITeamItemContext } from "@sneat/team/models";
import firebase from "firebase/compat";
import { map } from "rxjs/operators";
import { TeamItemService } from "./team-item.service";
import { Observable, tap } from "rxjs";
import Item = firebase.analytics.Item;

export abstract class TeamModuleService<Brief, Dto extends Brief> extends TeamItemService<Brief, Dto> {

	// protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	protected constructor(
		moduleID: string,
		afs: AngularFirestore
	) {
		// this.sfs = new SneatFirestoreService<Brief, Dto>(collectionName, afs);
		super(moduleID, "modules", afs, undefined as unknown as SneatApiService);
	}

	watchTeamModuleRecord(team: ITeamContext): Observable<IDtoAndID<Dto>> {
		const logPrefix = `watchTeamModuleEntry(teamID=${team.id}, moduleID=${this.moduleID})`;
		console.log(logPrefix);
		const collectionRef = collection(this.teamsCollection, team.id, "modules") as CollectionReference<Dto>;
		const result = this.sfs.watchByID<Dto>(collectionRef, this.moduleID)
			.pipe(
				map(o => ({ team, ...o })),
				tap(o => console.log(`${logPrefix} =>`, o))
			);
		return result;
	}

	watchBriefs<ItemBrief, ItemDto>(
		team: ITeamContext,
		getBriefs: (dto?: Dto) => Readonly<{
			[id: string]: ItemBrief
		}> ): Observable<ITeamItemContext<ItemBrief, ItemDto>[]> {
		const o = this.watchTeamModuleRecord(team);
		const result = o.pipe(
			map(teamModule => {
				const briefs = getBriefs(teamModule?.dto || undefined);
				const items: ITeamItemContext<ItemBrief, ItemDto>[] = briefs
					? Object.keys(briefs).map(id => ({ id, brief: briefs[id], team }))
					: [];
				return items;
			})
		);
		return result;
	}
}
