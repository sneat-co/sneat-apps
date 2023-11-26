import {
	Firestore as AngularFirestore,
	doc,
	collection,
	CollectionReference,
} from '@angular/fire/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { IQueryArgs, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IIdAndBriefAndDto } from '@sneat/core';
import { ITeamDto } from '@sneat/dto';
import {
	ITeamContext,
	ITeamItemNavContext,
	ITeamItemWithBriefAndDto,
	ITeamRef,
	ITeamRequest,
} from '@sneat/team-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ICreateTeamItemResponse<
	Brief,
	Dto extends Brief,
> = ITeamItemWithBriefAndDto<Brief, Dto>;

abstract class TeamItemBaseService<Brief, Dto extends Brief> {
	protected readonly sfs: SneatFirestoreService<Brief, Dto>;

	protected constructor(
		public readonly collectionName: string,
		public readonly afs: AngularFirestore,
		public readonly sneatApiService: SneatApiService,
	) {
		if (!this.collectionName) {
			throw new Error('collectionName is required');
		}
		this.sfs = new SneatFirestoreService<Brief, Dto>();
	}

	protected abstract collectionRef<Dto2 extends Dto>(
		teamID: string,
	): CollectionReference<Dto2>;

	public watchTeamItemByIdWithTeamRef<Dto2 extends Dto>(
		team: ITeamRef,
		itemID: string,
	): Observable<ITeamItemNavContext<Brief, Dto2>> {
		console.log(
			`TeamItemBaseService.watchTeamItemByIdWithTeamRef(team=${team.id}, itemID=${itemID}), collectionName=${this.collectionName}`,
		);
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

	protected queryItems<Dto2 extends Dto>(
		collectionRef: CollectionReference<Dto2>,
		queryArgs?: IQueryArgs,
	): Observable<IIdAndBriefAndDto<Brief, Dto2>[]> {
		const $querySnapshot = this.sfs.watchSnapshotsByFilter<Dto2>(
			collectionRef,
			queryArgs,
		);
		return $querySnapshot.pipe(
			map((querySnapshot) => {
				return this.mapQueryItem<Dto2>(
					querySnapshot as unknown as QuerySnapshot<Dto2>,
				);
			}),
		);
	}

	protected mapQueryItem<Dto2 extends Dto>(
		querySnapshot: QuerySnapshot<Dto2>,
	): IIdAndBriefAndDto<Brief, Dto2>[] {
		return querySnapshot.docs.map((docSnapshot) => {
			const dto = docSnapshot.data();
			const { id } = docSnapshot;
			const brief: Brief = dto;
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
	): Observable<ITeamItemWithBriefAndDto<Brief, Dto>> {
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
					const item: ITeamItemWithBriefAndDto<Brief, Dto> = {
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

	public watchGlobalItems<Dto2 extends Dto>(
		queryArgs: IQueryArgs,
	): Observable<IIdAndBriefAndDto<Brief, Dto2>[]> {
		console.log('watchGlobalItems()', this.collectionName);
		const collectionRef = this.collectionRef<Dto2>();
		return this.queryItems<Dto2>(collectionRef, queryArgs);
	}

	public watchGlobalTeamItemsWithTeamRef<Dto2 extends Dto>(
		team: ITeamRef,
		queryArgs: IQueryArgs,
	): Observable<ITeamItemWithBriefAndDto<Brief, Dto2>[]> {
		return this.watchGlobalTeamItems<Dto2>(team.id, queryArgs).pipe(
			map((items) => items.map((item) => ({ ...item, team }))),
		);
	}

	public watchGlobalTeamItems<Dto2 extends Dto>(
		teamID: string,
		queryArgs: IQueryArgs,
	): Observable<IIdAndBriefAndDto<Brief, Dto2>[]> {
		console.log('watchModuleTeamItems()', teamID, this.collectionName);
		queryArgs = {
			...queryArgs,
			filter: [
				...(queryArgs?.filter || []),
				{ field: 'teamIDs', operator: '==', value: teamID },
			],
		};
		const collectionRef = this.collectionRef<Dto2>();
		return this.queryItems<Dto2>(collectionRef, queryArgs);
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
		if (!moduleID) {
			throw new Error('moduleID is required');
		}
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
		if (!teamID) {
			throw new Error('teamID is required');
		}
		return collection(
			this.teamsCollection,
			teamID,
			'modules',
			this.moduleID,
			this.collectionName,
		) as CollectionReference<Dto2>;
	}

	private readonly teamRef = (id: string) => doc(this.teamsCollection, id);

	public watchModuleTeamItemsWithTeamRef<Dto2 extends Dto>(
		team: ITeamRef,
		queryArgs?: IQueryArgs,
	): Observable<ITeamItemWithBriefAndDto<Brief, Dto2>[]> {
		return this.watchModuleTeamItems<Dto2>(team.id, queryArgs).pipe(
			map((items) => items.map((item) => ({ ...item, team }))),
		);
	}

	public watchModuleTeamItems<Dto2 extends Dto>(
		teamID: string,
		queryArgs?: IQueryArgs,
	): Observable<IIdAndBriefAndDto<Brief, Dto2>[]> {
		console.log('watchModuleTeamItems()', teamID, this.collectionName);
		// filter = [
		// 	...(filter || []),
		// 	// { field: 'teamIDs', operator: '==', value: teamID },
		// ];
		const collectionRef = this.collectionRef<Dto2>(teamID);
		return this.queryItems<Dto2>(collectionRef, queryArgs);
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
