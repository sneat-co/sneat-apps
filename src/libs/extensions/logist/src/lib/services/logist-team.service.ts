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
	ILogistTeamBrief,
	ILogistTeamContext,
	ILogistTeamDto,
	ISetLogistTeamSettingsRequest,
} from '../dto/logist-team-dto';


function briefFromDto(id: string, dto: ILogistTeamDto): ILogistTeamBrief {
	return {
		id,
		...dto,
	};
}

@Injectable()
export class LogistTeamService {
	private readonly sfs: SneatFirestoreService<ILogistTeamBrief, ILogistTeamDto>;

	constructor(
		private readonly sneatApiService: SneatApiService,
		private readonly afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<ILogistTeamBrief, ILogistTeamDto>(
			'logist_team', afs, briefFromDto);
	}

	public watchLogistTeamByID(teamID: string): Observable<ILogistTeamContext> {
		return this.sfs.watchByDocRef(logistTeamDocRef(this.afs, teamID));
	}

	setLogistTeamSettings(request: ISetLogistTeamSettingsRequest): Observable<void> {
		return this.sneatApiService.post('logist/set_logist_team_settings', request);
	}

}

function logistTeamDocRef(afs: AngularFirestore, teamID: string): DocumentReference<ILogistTeamDto> {
	const teamsCollection = collection(afs, 'teams');
	const teamRef = doc(teamsCollection, teamID);
	const modulesCollection = collection(teamRef, 'modules');
	return doc<ILogistTeamDto>(modulesCollection as CollectionReference<ILogistTeamDto>, 'logist');
}

export function logistTeamModuleSubCollection<Dto>(afs: AngularFirestore, teamID: string, collectionName: string): CollectionReference<Dto> {
	const moduleRef = logistTeamDocRef(afs, teamID);
	return collection(moduleRef, collectionName) as CollectionReference<Dto>;
}

@NgModule({
	imports: [],
	providers: [
		LogistTeamService,
	],
})
export class LogistTeamServiceModule {
}
