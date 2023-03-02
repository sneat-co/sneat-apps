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
	IExpressTeamBrief,
	IExpressTeamContext,
	IExpressTeamDto,
	ISetExpressTeamSettingsRequest,
} from '../dto/express-team-dto';


function briefFromDto(id: string, dto: IExpressTeamDto): IExpressTeamBrief {
	return {
		id,
		...dto,
	};
}

@Injectable()
export class ExpressTeamService {
	private readonly sfs: SneatFirestoreService<IExpressTeamBrief, IExpressTeamDto>;

	constructor(
		private readonly sneatApiService: SneatApiService,
		private readonly afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<IExpressTeamBrief, IExpressTeamDto>(
			'express_team', afs, briefFromDto);
	}

	public watchExpressTeamByID(teamID: string): Observable<IExpressTeamContext> {
		return this.sfs.watchByDocRef(expressTeamDocRef(this.afs, teamID));
	}

	setExpressTeamSettings(request: ISetExpressTeamSettingsRequest): Observable<void> {
		return this.sneatApiService.post('express/set_express_team_settings', request);
	}

}

function expressTeamDocRef(afs: AngularFirestore, teamID: string): DocumentReference<IExpressTeamDto> {
	const teamsCollection = collection(afs, 'teams');
	const teamRef = doc(teamsCollection, teamID);
	const modulesCollection = collection(teamRef, 'modules') as CollectionReference<IExpressTeamDto>;
	return doc<IExpressTeamDto>(modulesCollection, 'express');
}

export function expressTeamModuleSubCollection<Dto>(afs: AngularFirestore, teamID: string, collectionName: string): CollectionReference<Dto> {
	const moduleRef = expressTeamDocRef(afs, teamID);
	return collection(moduleRef, collectionName) as CollectionReference<Dto>;
}

@NgModule({
	imports: [],
	providers: [
		ExpressTeamService,
	],
})
export class ExpressTeamServiceModule {
}
