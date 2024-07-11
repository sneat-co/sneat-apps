import { Injectable, NgModule } from '@angular/core';
import {
	Firestore as AngularFirestore,
	CollectionReference,
	DocumentReference,
	collection,
	doc,
} from '@angular/fire/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { Observable } from 'rxjs';
import {
	ILogistSpaceBrief,
	ILogistSpaceContext,
	ILogistSpaceDbo,
	ISetLogistSpaceSettingsRequest,
} from '../dto/logist-team-dto';

function briefFromDto(id: string, dto: ILogistSpaceDbo): ILogistSpaceBrief {
	return dto;
}

@Injectable()
export class LogistTeamService {
	private readonly sfs: SneatFirestoreService<
		ILogistSpaceBrief,
		ILogistSpaceDbo
	>;

	constructor(
		private readonly sneatApiService: SneatApiService,
		private readonly afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<ILogistSpaceBrief, ILogistSpaceDbo>(
			briefFromDto,
		);
	}

	public watchLogistTeamByID(teamID: string): Observable<ILogistSpaceContext> {
		return this.sfs.watchByDocRef(logistTeamDocRef(this.afs, teamID));
	}

	setLogistTeamSettings(
		request: ISetLogistSpaceSettingsRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'logistus/set_logist_team_settings?ts=' + new Date().toISOString(),
			request,
		);
	}
}

function logistTeamDocRef(
	afs: AngularFirestore,
	teamID: string,
): DocumentReference<ILogistSpaceDbo> {
	const teamsCollection = collection(afs, 'spaces');
	const teamRef = doc(teamsCollection, teamID);
	const modulesCollection = collection(teamRef, 'modules');
	return doc(
		modulesCollection as CollectionReference<ILogistSpaceDbo>,
		'logistus',
	);
}

export function logistTeamModuleSubCollection<Dto>(
	afs: AngularFirestore,
	teamID: string,
	collectionName: string,
): CollectionReference<Dto> {
	const moduleRef = logistTeamDocRef(afs, teamID);
	return collection(moduleRef, collectionName) as CollectionReference<Dto>;
}

@NgModule({
	imports: [],
	providers: [LogistTeamService],
})
export class LogistTeamServiceModule {}
