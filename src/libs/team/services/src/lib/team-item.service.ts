// import { collection } from '@angular/fire/firestore';
import {
	Firestore as AngularFirestore,
	doc,
	collection,
	CollectionReference,
} from '@angular/fire/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { IFilter, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { ITeamContext, ITeamItemContext, ITeamRequest } from '@sneat/team/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ICreateTeamItemResponse<Brief, Dto extends Brief> = ITeamItemContext<Brief, Dto>;

export class TeamItemService<Brief, Dto extends Brief> {
	private readonly teamsCollection;
	private readonly modulesCollection;
	protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	constructor(
		public readonly collectionName: string,
		public readonly afs: AngularFirestore,
		public readonly sneatApiService: SneatApiService,
	) {
		this.modulesCollection = collection(this.afs, 'modules');
		this.teamsCollection = collection(this.afs, 'teams');
		this.sfs = new SneatFirestoreService<Brief, Dto>(collectionName, afs);
	}

	protected readonly dto2brief = (id: string, dto: Dto) => ({ id, ...dto });

	// protected teamCollection(teamID: string): AngularFirestoreCollection<ITeamDto> {
	// 	return this.afs.collection('teams');
	// }

	public watchTeamItemByID<Dto2 extends Dto>(team: ITeamContext, id: string): Observable<ITeamItemContext<Brief, Dto2>> {
		const collectionRef = collection(this.teamRef(team.id), this.collectionName);
		// const collection = this.teamsCollection.doc(team.id).collection<Dto2>(this.collectionName);
		const result = this.sfs.watchByID<Dto2>(collectionRef as CollectionReference<Dto2>, id)
			.pipe(
				map(o => ({ team, ...o })),
			);
		return result;
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
		filter.push({ field: 'teamIDs', operator: 'in', value: team.id });
		const moduleDocRef = doc(this.modulesCollection, moduleID);
		const collectionRef = collection(moduleDocRef, this.collectionName);
		const querySnapshots = this.sfs.watchSnapshotsByFilter<Dto2>(collectionRef as CollectionReference<Dto2>, filter || []);
		return querySnapshots.pipe(
			map(querySnapshot => this.mapQueryToTeamItemContext(team, querySnapshot as unknown as QuerySnapshot<Dto2>)),
		);
	}

	private readonly mapQueryToTeamItemContext = <Brief2 extends Brief, Dto2 extends Dto>(team: ITeamContext, querySnapshot: QuerySnapshot<Dto2>) => {
		console.log(`team item changeActions (${this.collectionName}): `, querySnapshot);
		return querySnapshot.docs.map(docSnapshot => {
			const dto = docSnapshot.data();
			const { id } = docSnapshot;
			const brief: Brief2 = { id, ...dto } as unknown as Brief2;
			const c: ITeamItemContext<Brief2, Dto2> = { id, team, dto, brief };
			return c;
		});
	};


	public watchTeamItems<Brief2 extends Brief, Dto2 extends Dto>(
		team: ITeamContext,
		filter?: IFilter[],
	): Observable<ITeamItemContext<Brief2, Dto2>[]> {
		console.log('watchTeamItems()', team.id, this.collectionName);
		const collectionRef = collection(this.teamRef(team.id), this.collectionName);
		const querySnapshots = this.sfs.watchSnapshotsByFilter<Dto2>(collectionRef as CollectionReference<Dto2>, filter || []);
		return querySnapshots.pipe(
			map(querySnapshot => this.mapQueryToTeamItemContext(team, querySnapshot as unknown as QuerySnapshot<Dto2>)),
		);
	}


	public deleteTeamItem<Response>(endpoint: string, request: ITeamRequest): Observable<Response> {
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
				map(response => {
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
