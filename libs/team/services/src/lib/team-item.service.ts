import {
	Firestore as AngularFirestore,
	doc,
	collection,
	CollectionReference,
} from '@angular/fire/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { IFilter, SneatApiService, SneatFirestoreService } from '@sneat/api';
import {
	ITeamContext,
	ITeamItemContext,
	ITeamRequest,
} from '@sneat/team/models';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

type ICreateTeamItemResponse<Brief, Dto extends Brief> = ITeamItemContext<
	Brief,
	Dto
>;

export class TeamItemService<Brief, Dto extends Brief> {
	protected readonly teamsCollection;
	protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	constructor(
		public readonly moduleID: string,
		public readonly collectionName: string,
		public readonly afs: AngularFirestore,
		public readonly sneatApiService: SneatApiService,
	) {
		this.teamsCollection = collection(this.afs, 'teams');
		this.sfs = new SneatFirestoreService<Brief, Dto>();
	}

	protected readonly dto2brief = (id: string, dto: Dto) => ({ id, ...dto });

	// protected teamCollection(teamID: string): AngularFirestoreCollection<ITeamDto> {
	// 	return this.afs.collection('teams');
	// }

	private collectionRef<Dto2 extends Dto>(teamID: string) {
		return collection(
			this.teamsCollection,
			teamID,
			'modules',
			this.moduleID,
			this.collectionName,
		) as CollectionReference<Dto2>;
	}

	public watchTeamItemByID<Dto2 extends Dto>(
		team: ITeamContext,
		id: string,
	): Observable<ITeamItemContext<Brief, Dto2>> {
		console.log('watchTeamItemByID()', team.id, this.collectionName, id);
		const collectionRef = this.collectionRef<Dto2>(team.id);
		return this.sfs.watchByID(collectionRef, id).pipe(
			map((o) => ({ team, ...o })),
			tap((o) =>
				console.log(
					'watchTeamItemByID()',
					team.id,
					this.collectionName,
					id,
					' =>',
					o,
				),
			),
		);
	}

	private readonly teamRef = (id: string) => doc(this.teamsCollection, id);

	public watchModuleTeamItems<Brief2 extends Brief, Dto2 extends Dto>(
		moduleID: string,
		team: ITeamContext,
		filter?: IFilter[],
	): Observable<ITeamItemContext<Brief2, Dto2>[]> {
		console.log('watchModuleTeamItems()', team.id, this.collectionName);
		if (!filter) {
			filter = [];
		}
		filter.push({ field: 'teamIDs', operator: '==', value: team.id });
		const collectionRef = collection(
			this.teamsCollection,
			team.id,
			'modules',
			moduleID,
			this.collectionName,
		);
		const querySnapshots = this.sfs.watchSnapshotsByFilter<Dto2>(
			collectionRef as CollectionReference<Dto2>,
			filter || [],
		);
		return querySnapshots.pipe(
			map((querySnapshot) =>
				this.mapQueryToTeamItemContext(
					team,
					querySnapshot as unknown as QuerySnapshot<Dto2>,
				),
			),
		);
	}

	private readonly mapQueryToTeamItemContext = <
		Brief2 extends Brief,
		Dto2 extends Dto,
	>(
		team: ITeamContext,
		querySnapshot: QuerySnapshot<Dto2>,
	) => {
		console.log(
			`team item changeActions (${this.collectionName}): `,
			querySnapshot,
		);
		return querySnapshot.docs.map((docSnapshot) => {
			const dto = docSnapshot.data();
			const { id } = docSnapshot;
			const brief: Brief2 = { id, ...dto } as unknown as Brief2;
			const c: ITeamItemContext<Brief2, Dto2> = { id, team, dto, brief };
			return c;
		});
	};

	public watchTeamItems<Brief2 extends Brief, Dto2 extends Dto>(
		team: ITeamContext,
		filter?: readonly IFilter[],
	): Observable<ITeamItemContext<Brief2, Dto2>[]> {
		console.log('watchTeamItems()', team.id, this.collectionName);
		const collectionRef = collection(
			this.teamRef(team.id),
			this.collectionName,
		);
		const querySnapshots = this.sfs.watchSnapshotsByFilter<Dto2>(
			collectionRef as CollectionReference<Dto2>,
			filter || [],
		);
		return querySnapshots.pipe(
			map((querySnapshot) =>
				this.mapQueryToTeamItemContext(
					team,
					querySnapshot as unknown as QuerySnapshot<Dto2>,
				),
			),
		);
	}

	public deleteTeamItem<Response>(
		endpoint: string,
		request: ITeamRequest,
	): Observable<Response> {
		return this.sneatApiService.delete<Response>(endpoint, undefined, request);
	}

	public createTeamItem<Brief, Dto extends Brief>(
		endpoint: string,
		team: ITeamContext,
		request: ITeamRequest,
	): Observable<ITeamItemContext<Brief, Dto>> {
		console.log(`TeamItemBaseService.createTeamItem()`, request);
		return this.sneatApiService
			.post<ICreateTeamItemResponse<Brief, Dto>>(endpoint, request)
			.pipe(
				map((response) => {
					if (!response) {
						throw new Error('create team item response is empty');
					}
					if (!response.id) {
						throw new Error('create team item response have no ID');
					}
					const item: ITeamItemContext<Brief, Dto> = {
						team,
						id: response.id,
						dto: response.dto,
						brief: { id: response.id, ...response.dto } as unknown as Brief,
					};
					return item;
				}),
			);
	}
}
