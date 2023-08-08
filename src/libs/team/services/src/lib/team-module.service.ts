import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ITeamContext, ITeamItemContext } from '@sneat/team/models';
import { TeamItemService } from './team-item.service';
import { Observable } from 'rxjs';

export abstract class TeamModuleService<Brief, Dto extends Brief> extends TeamItemService<Brief, Dto> {
	protected constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
		protected readonly moduleID: string,
	) {
		super('modules', afs, sneatApiService);
	}

	watchTeamModuleRecord(team: ITeamContext): Observable<ITeamItemContext<Brief, Dto>> {
		return this.watchTeamItemByID(team, this.moduleID);
	}
}
