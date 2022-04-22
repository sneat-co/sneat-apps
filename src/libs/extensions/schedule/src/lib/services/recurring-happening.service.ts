import { Injectable, NgModule } from '@angular/core';
import { SneatFirestoreService } from '@sneat/api';
import { IAssetBrief, IAssetDto, IHappeningBrief, IRecurringHappeningDto } from '@sneat/dto';
import { IRecurringContext, ITeamContext } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class RecurringHappeningService {
	private readonly sfs: SneatFirestoreService<IHappeningBrief, IRecurringHappeningDto>;

	constructor(
		private readonly teamItemBaseService: TeamItemBaseService,
	) {
		this.sfs = new SneatFirestoreService<IHappeningBrief, IRecurringHappeningDto>(
			'recurring_happenings', teamItemBaseService.afs, (id: string, dto: IRecurringHappeningDto) => {
				const brief: IHappeningBrief = {
					id, ...dto,
				};
				return brief;
			},
		);
	}

	deleteRecurring(recurring: IRecurringContext): Observable<void> {
		return throwError(() => 'not implemented yet');
	}

	watchByTeam(team: ITeamContext): Observable<IRecurringContext[]> {
		return this.sfs.watchByTeamID(team.id);
	}

	watchRecurringByID(id: string): Observable<IRecurringContext> {
		return this.sfs.watchByID(id);
	}
}

@NgModule({
	providers: [
		RecurringHappeningService,
	],
})
export class RecurringHappeningServiceModule {
}
