import { collection, CollectionReference, Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IDtoAndID, ITeamContext } from '@sneat/team/models';
import { map } from 'rxjs/operators';
import { TeamItemService } from './team-item.service';
import { Observable, tap } from 'rxjs';

export abstract class TeamModuleService<Brief, Dto extends Brief> extends TeamItemService<Brief, Dto> {

	// protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	protected constructor(
		moduleID: string,
		afs: AngularFirestore,
	) {
		// this.sfs = new SneatFirestoreService<Brief, Dto>(collectionName, afs);
		super(moduleID, 'modules', afs, undefined as unknown as SneatApiService);
	}

	watchTeamModuleRecord(team: ITeamContext): Observable<IDtoAndID<Dto>> {
		const logPrefix = `watchTeamModuleEntry(teamID=${team.id}, moduleID=${this.moduleID})`;
		console.log(logPrefix);
		const collectionRef = collection(this.teamsCollection, team.id, 'modules') as CollectionReference<Dto>;
		const result = this.sfs.watchByID<Dto>(collectionRef, this.moduleID)
			.pipe(
				map(o => ({ team, ...o })),
				tap(o => console.log(`${logPrefix} =>`, o)),
			);
		return result;
	}
}
