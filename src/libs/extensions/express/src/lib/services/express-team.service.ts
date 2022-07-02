import { Injectable, NgModule } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { map, Observable } from 'rxjs';
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
		return this.afs
			.collection('teams').doc(teamID)
			.collection<IExpressTeamDto>('modules').doc('express')
			.snapshotChanges()
			.pipe(
				map(docSnapshot => {
					return this.sfs.docSnapshotToContext(docSnapshot.payload);
				}),
			);
	}

	setExpressTeamSettings(request: ISetExpressTeamSettingsRequest): Observable<void> {
		return this.sneatApiService.post('express/set_express_team_settings', request);
	}

}

@NgModule({
	imports: [],
	providers: [
		ExpressTeamService,
	],
})
export class ExpressTeamServiceModule {
}
