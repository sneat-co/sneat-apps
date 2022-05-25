import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { INavContext } from '@sneat/core';
import { TeamCounter } from '@sneat/dto';
import { ITeamContext, ITeamItemContext, ITeamRequest } from '@sneat/team/models';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamService } from './team.service';

type ICreateTeamItemResponse<Brief, Dto> = INavContext<Brief, Dto>;

@Injectable({ providedIn: 'root' })
export class TeamItemBaseService {
	constructor(
		public readonly afs: AngularFirestore,
		public readonly sneatApiService: SneatApiService,
		public readonly teamService: TeamService,
	) {
	}


	public watchTeamItems<Brief extends { id: string }, Dto>(team: ITeamContext, path: string): Observable<ITeamItemContext<Brief, Dto>[]> {
		console.log('watchTeamItems()', team.id);
		const query = this.afs
			.collection<Dto>(path,
				ref => ref.where('teamIDs', 'array-contains', team.id));
		const result = query.get()
			.pipe(
				map(changes => {
					console.log(`team item changes (${path}): `, changes.docs);
					return changes.docs.map(d => {
						const dto = d.data();
						const { id } = d;
						const brief: Brief = { id, ...dto } as unknown as Brief;
						const asset: ITeamItemContext<Brief, Dto> = { id: d.id, team, dto, brief };
						return asset;
					});
				}),
			);
		return result;
	}


	public createTeamItem<Brief extends { id: string }, Dto>(endpoint: string, numberOfCounter: TeamCounter, request: ITeamRequest): Observable<INavContext<Brief, Dto>> {
		console.log(`TeamItemBaseService.createTeamItem()`, request);
		return this.sneatApiService
			.post<ICreateTeamItemResponse<Brief, Dto>>(endpoint, request)
			.pipe(
				map(response => {
					if (!response) {
						throw new Error('create team item response is empty');
					}
					if (!response.id) {
						throw new Error('create team item response have no ID');
					}
					const item: INavContext<Brief, Dto> = {
						id: response.id,
						dto: response.dto,
						brief: { id: response.id, ...response.dto } as unknown as Brief,
					};
					return item;
				}),
				tap(() => {
					this.teamService.getTeam({id: request.teamID}).subscribe({
						next: team => {
							if (team.dto) {
								if (!team.dto?.numberOf) {
									team = { ...team, dto: { ...team.dto || {}, numberOf: {} } };
								}
								if (team?.dto?.numberOf) {
									team.dto.numberOf[numberOfCounter] = (team.dto.numberOf[numberOfCounter] || 0) + 1;
								}
								this.teamService.onTeamUpdated(team);
							}
						},
					});
				}),
			);
	}
}
