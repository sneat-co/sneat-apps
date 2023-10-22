import {
	Firestore as AngularFirestore,
	doc,
	collection,
	CollectionReference,
} from '@angular/fire/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { IFilter, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IIdAndBriefAndDto, ITeamDto } from '@sneat/dto';
import {
	ITeamContext,
	ITeamItemContext,
	ITeamItemWithTeamRef,
	ITeamRef,
	ITeamRequest,
} from '@sneat/team/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ICreateTeamItemResponse<Brief, Dto extends Brief> = ITeamItemContext<
	Brief,
	Dto
>;

abstract class TeamItemBaseService<Brief, Dto extends Brief> {
	protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	protected constructor(
		public readonly collectionName: string,
		public readonly afs: AngularFirestore,
		public readonly sneatApiService: SneatApiService,
	) {
		this.sfs = new SneatFirestoreService<Brief, Dto>();
	}

	protected abstract collectionRef<Dto2 extends Dto>(
		teamID: string,
	): CollectionReference<Dto2>;

	public watchTeamItemByIdWithTeamRef<Dto2 extends Dto>(
		team: ITeamRef,
		itemID: string,
	): Observable<ITeamItemContext<Brief, Dto2>> {
		console.log('watchTeamItemByID()', this.collectionName, team.id, itemID);
		const collectionRef = this.collectionRef<Dto2>(team.id);
		return this.sfs.watchByID(collectionRef, itemID).pipe(
			map((o) => ({ team, ...o })),
			// tap((o) =>
			//   console.log(
			//     'watchTeamItemByID()',
			//     team.id,
			//     this.collectionName,
			//     itemID,
			//     ' =>',
			//     o,
			//   ),
			// ),
		);
	}

	protected queryTeamItems<Brief2 extends Brief, Dto2 extends Dto>(
		collectionRef: CollectionReference<Dto2>,
		filter?: readonly IFilter[],
	): Observable<IIdAndBriefAndDto<Brief2, Dto2>[]> {
		const $querySnapshot = this.sfs.watchSnapshotsByFilter<Dto2>(
			collectionRef,
			filter || [],
		);
		return $querySnapshot.pipe(
			map((querySnapshot) => {
				return this.mapQueryItem<Brief2, Dto2>(
					querySnapshot as unknown as QuerySnapshot<Dto2>,
				);
			}),
		);
	}

	protected mapQueryItem<Brief2 extends Brief, Dto2 extends Dto>(
		querySnapshot: QuerySnapshot<Dto2>,
	): IIdAndBriefAndDto<Brief2, Dto2>[] {
		return querySnapshot.docs.map((docSnapshot) => {
			const dto = docSnapshot.data();
			const { id } = docSnapshot;
			const brief = dto as unknown as Brief2;
			return { id, brief, dto };
		});
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

// At the moment reserved to `happenings` only
export class GlobalTeamItemService<
	Brief,
	Dto extends Brief,
> extends TeamItemBaseService<Brief, Dto> {
	constructor(
		collectionName: string,
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		super(collectionName, afs, sneatApiService);
	}

	protected override collectionRef<
		Dto2 extends Dto,
	>(): CollectionReference<Dto2> {
		return collection(
			this.afs,
			this.collectionName,
		) as CollectionReference<Dto2>;
	}

	public watchGlobalTeamItemsWithTeamRef<
		Brief2 extends Brief,
		Dto2 extends Dto,
	>(
		team: ITeamRef,
		filter?: readonly IFilter[],
	): Observable<ITeamItemWithTeamRef<Brief2, Dto2>[]> {
		return this.watchGlobalTeamItems<Brief2, Dto2>(team.id, filter).pipe(
			map((items) => items.map((item) => ({ ...item, team }))),
		);
	}

	public watchGlobalTeamItems<Brief2 extends Brief, Dto2 extends Dto>(
		teamID: string,
		filter?: readonly IFilter[],
	): Observable<IIdAndBriefAndDto<Brief2, Dto2>[]> {
		console.log('watchModuleTeamItems()', teamID, this.collectionName);
		filter = [
			...(filter || []),
			{ field: 'teamIDs', operator: '==', value: teamID },
		];
		const collectionRef = this.collectionRef<Dto2>();
		return this.queryTeamItems<Brief2, Dto2>(collectionRef, filter);
	}
}

export class ModuleTeamItemService<
	Brief,
	Dto extends Brief,
> extends TeamItemBaseService<Brief, Dto> {
	protected readonly teamsCollection: CollectionReference<ITeamDto>;

	constructor(
		public readonly moduleID: string,
		collectionName: string,
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		super(collectionName, afs, sneatApiService);
		this.teamsCollection = collection(
			this.afs,
			'teams',
		) as CollectionReference<ITeamDto>;
	}

	protected readonly dto2brief = (id: string, dto: Dto) => ({ id, ...dto });

	// protected teamCollection(teamID: string): AngularFirestoreCollection<ITeamDto> {
	// 	return this.afs.collection('teams');
	// }

	protected override collectionRef<Dto2 extends Dto>(
		teamID: string,
	): CollectionReference<Dto2> {
		return collection(
			this.teamsCollection,
			teamID,
			'modules',
			this.moduleID,
			this.collectionName,
		) as CollectionReference<Dto2>;
	}

	private readonly teamRef = (id: string) => doc(this.teamsCollection, id);

	public watchModuleTeamItemsWithTeamRef<
		Brief2 extends Brief,
		Dto2 extends Dto,
	>(
		team: ITeamRef,
		filter?: readonly IFilter[],
	): Observable<ITeamItemWithTeamRef<Brief2, Dto2>[]> {
		return this.watchModuleTeamItems<Brief2, Dto2>(
			this.moduleID,
			team.id,
			filter,
		).pipe(map((items) => items.map((item) => ({ ...item, team }))));
	}

	public watchModuleTeamItems<Brief2 extends Brief, Dto2 extends Dto>(
		moduleID: string,
		teamID: string,
		filter?: readonly IFilter[],
	): Observable<IIdAndBriefAndDto<Brief2, Dto2>[]> {
		console.log('watchModuleTeamItems()', teamID, this.collectionName);
		filter = [
			...(filter || []),
			{ field: 'teamIDs', operator: '==', value: teamID },
		];
		const collectionRef = this.collectionRef<Dto2>(teamID);
		return this.queryTeamItems<Brief2, Dto2>(collectionRef, filter);
	}

	// private readonly mapItemTeamItemContext = <
	//   Brief2 extends Brief,
	//   Dto2 extends Dto,
	// >(
	//   team: ITeamContext,
	//   item: IIdAndBrief<Brief2, Dto2>,
	// ) => {
	//   return querySnapshot.docs.map((docSnapshot) => {
	//     const dto = docSnapshot.data();
	//     const { id } = docSnapshot;
	//     const brief: Brief2 = { id, ...dto } as unknown as Brief2;
	//     const c: ITeamItemContext<Brief2, Dto2> = { id, team, dto, brief };
	//     return c;
	//   });
	// };

	// public watchTeamItems<Brief2 extends Brief, Dto2 extends Dto>(
	//   teamID: string,
	//   filter?: readonly IFilter[],
	// ): Observable<IIdAndBriefAndDto<Brief2, Dto2>[]> {
	//   console.log('watchTeamItems()', teamID, this.collectionName);
	//   const collectionRef = collection(
	//     this.teamRef(teamID),
	//     this.collectionName,
	//   );
	//   const querySnapshots = this.sfs.watchSnapshotsByFilter<Dto2>(
	//     collectionRef as CollectionReference<Dto2>,
	//     filter || [],
	//   );
	//   return querySnapshots.pipe(
	//     map(a => this.mapQueryItem(a)),
	//   );
	// }

	// public watchTeamItemsWithTeamContext<Brief2 extends Brief, Dto2 extends Dto>(
	//   team: ITeamRef,
	//   filter?: readonly IFilter[],
	// ): Observable<ITeamItemContext<Brief2, Dto2>[]> {
	//   const querySnapshots = this.watchTeamItems(team.id, filter);
	//   return querySnapshots.pipe(
	//     map((querySnapshot) =>
	//       this.mapItemTeamItemContext(
	//         team,
	//         querySnapshot as unknown as QuerySnapshot<Dto2>,
	//       ),
	//     ),
	//   );
	// }
}
