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
} from '../dto/express-team-dto';


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
			'express_team', afs, briefFromDto);
	}

	public watchExpressTeamByID(teamID: string): Observable<ILogistTeamContext> {
		return this.sfs.watchByDocRef(expressTeamDocRef(this.afs, teamID));
	}

	setExpressTeamSettings(request: ISetLogistTeamSettingsRequest): Observable<void> {
		return this.sneatApiService.post('express/set_express_team_settings', request);
	}

}

function expressTeamDocRef(afs: AngularFirestore, teamID: string): DocumentReference<ILogistTeamDto> {
	const teamsCollection = collection(afs, 'teams');
	const teamRef = doc(teamsCollection, teamID);
	const modulesCollection = collection(teamRef, 'modules') as CollectionReference<ILogistTeamDto>;
	return doc<ILogistTeamDto>(modulesCollection, 'express');
}

export function expressTeamModuleSubCollection<Dto>(afs: AngularFirestore, teamID: string, collectionName: string): CollectionReference<Dto> {
	const moduleRef = expressTeamDocRef(afs, teamID);
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
