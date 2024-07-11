import {
	Firestore as AngularFirestore,
	doc,
	collection,
	CollectionReference,
} from '@angular/fire/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { IQueryArgs, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IIdAndBriefAndDbo } from '@sneat/core';
import { ISpaceDbo } from '@sneat/dto';
import {
	ISpaceContext,
	ISpaceItemNavContext,
	ISpaceItemWithBriefAndDbo,
	ISpaceRef,
	SpaceRequest,
} from '@sneat/team-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ICreateSpaceItemResponse<
	Brief,
	Dbo extends Brief,
> = ISpaceItemWithBriefAndDbo<Brief, Dbo>;

abstract class TeamItemBaseService<Brief, Dbo extends Brief> {
	protected readonly sfs: SneatFirestoreService<Brief, Dbo>;

	protected constructor(
		public readonly collectionName: string,
		public readonly afs: AngularFirestore,
		public readonly sneatApiService: SneatApiService,
	) {
		if (!this.collectionName) {
			throw new Error('collectionName is required');
		}
		console.log(
			`TeamItemBaseService.constructor() collectionName=${this.collectionName}`,
		);
		this.sfs = new SneatFirestoreService<Brief, Dbo>();
	}

	protected abstract collectionRef<Dbo2 extends Dbo>(
		spaceID: string,
	): CollectionReference<Dbo2>;

	public watchTeamItemByIdWithTeamRef<Dbo2 extends Dbo>(
		space: ISpaceRef,
		itemID: string,
	): Observable<ISpaceItemNavContext<Brief, Dbo2>> {
		console.log(
			`TeamItemBaseService.watchTeamItemByIdWithTeamRef(team=${space.id}, itemID=${itemID}), collectionName=${this.collectionName}`,
		);
		const collectionRef = this.collectionRef<Dbo2>(space.id);
		return this.sfs.watchByID(collectionRef, itemID).pipe(
			map((o) => ({ space, ...o })),
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

	protected queryItems<Dbo2 extends Dbo>(
		collectionRef: CollectionReference<Dbo2>,
		queryArgs?: IQueryArgs,
	): Observable<IIdAndBriefAndDbo<Brief, Dbo2>[]> {
		const $querySnapshot = this.sfs.watchSnapshotsByFilter<Dbo2>(
			collectionRef,
			queryArgs,
		);
		return $querySnapshot.pipe(
			map((querySnapshot) => {
				return this.mapQueryItem<Dbo2>(
					querySnapshot as unknown as QuerySnapshot<Dbo2>,
				);
			}),
		);
	}

	protected mapQueryItem<Dbo2 extends Dbo>(
		querySnapshot: QuerySnapshot<Dbo2>,
	): IIdAndBriefAndDbo<Brief, Dbo2>[] {
		return querySnapshot.docs.map((docSnapshot) => {
			const dto = docSnapshot.data();
			const { id } = docSnapshot;
			const brief: Brief = dto;
			return { id, brief, dbo: dto };
		});
	}

	public deleteTeamItem<Response>(
		endpoint: string,
		request: SpaceRequest,
	): Observable<Response> {
		return this.sneatApiService.delete<Response>(endpoint, undefined, request);
	}

	public createSpaceItem<Brief, Dbo extends Brief>(
		endpoint: string,
		space: ISpaceContext,
		request: SpaceRequest,
	): Observable<ISpaceItemWithBriefAndDbo<Brief, Dbo>> {
		console.log(`TeamItemBaseService.createTeamItem()`, request);
		return this.sneatApiService
			.post<ICreateSpaceItemResponse<Brief, Dbo>>(endpoint, request)
			.pipe(
				map((response) => {
					if (!response) {
						throw new Error('create team item response is empty');
					}
					if (!response.id) {
						throw new Error('create team item response have no ID');
					}
					const item: ISpaceItemWithBriefAndDbo<Brief, Dbo> = {
						space,
						id: response.id,
						dbo: response.dbo,
						brief: { id: response.id, ...response.dbo } as unknown as Brief,
					};
					return item;
				}),
			);
	}
}

// At the moment reserved to `happenings` only
export class GlobalTeamItemService<
	Brief,
	Dbo extends Brief,
> extends TeamItemBaseService<Brief, Dbo> {
	constructor(
		collectionName: string,
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		super(collectionName, afs, sneatApiService);
	}

	protected override collectionRef<
		Dbo2 extends Dbo,
	>(): CollectionReference<Dbo2> {
		return collection(
			this.afs,
			this.collectionName,
		) as CollectionReference<Dbo2>;
	}

	public watchGlobalItems<Dbo2 extends Dbo>(
		queryArgs: IQueryArgs,
	): Observable<IIdAndBriefAndDbo<Brief, Dbo2>[]> {
		console.log('watchGlobalItems()', this.collectionName);
		const collectionRef = this.collectionRef<Dbo2>();
		return this.queryItems<Dbo2>(collectionRef, queryArgs);
	}

	public watchGlobalTeamItemsWithTeamRef<Dbo2 extends Dbo>(
		space: ISpaceRef,
		queryArgs: IQueryArgs,
	): Observable<ISpaceItemWithBriefAndDbo<Brief, Dbo2>[]> {
		return this.watchGlobalSpaceItems<Dbo2>(space.id, queryArgs).pipe(
			map((items) => items.map((item) => ({ ...item, space }))),
		);
	}

	public watchGlobalSpaceItems<Dbo2 extends Dbo>(
		spaceID: string,
		queryArgs: IQueryArgs,
	): Observable<IIdAndBriefAndDbo<Brief, Dbo2>[]> {
		console.log('watchGlobalSpaceItems()', spaceID, this.collectionName);
		queryArgs = {
			...queryArgs,
			filter: [
				...(queryArgs?.filter || []),
				{ field: 'teamIDs', operator: '==', value: spaceID },
			],
		};
		const collectionRef = this.collectionRef<Dbo2>();
		return this.queryItems<Dbo2>(collectionRef, queryArgs);
	}
}

// intentionally not abstract
export class ModuleTeamItemService<
	Brief,
	Dbo extends Brief,
> extends TeamItemBaseService<Brief, Dbo> {
	protected readonly teamsCollection: CollectionReference<ISpaceDbo>;

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
			'spaces',
		) as CollectionReference<ISpaceDbo>;
	}

	protected readonly dto2brief = (id: string, dto: Dbo) => ({ id, ...dto });

	// protected teamCollection(spaceID: string): AngularFirestoreCollection<ITeamDto> {
	// 	return this.afs.collection('teams');
	// }

	protected override collectionRef<Dbo2 extends Dbo>(
		spaceID: string,
	): CollectionReference<Dbo2> {
		if (!spaceID) {
			throw new Error('teamID is required');
		}
		return collection(
			this.teamsCollection,
			spaceID,
			'modules',
			this.moduleID,
			this.collectionName,
		) as CollectionReference<Dbo2>;
	}

	private readonly spaceRef = (id: string) => doc(this.teamsCollection, id);

	public watchModuleSpaceItem<Dbo2 extends Dbo>(
		team: ISpaceRef,
		itemID: string,
	): Observable<IIdAndBriefAndDbo<Brief, Dbo2>[]> {
		console.log(team, itemID);
		throw new Error('Method not implemented.');
	}

	public watchModuleSpaceItemsWithTeamRef<Dbo2 extends Dbo>(
		space: ISpaceRef,
		queryArgs?: IQueryArgs,
	): Observable<ISpaceItemWithBriefAndDbo<Brief, Dbo2>[]> {
		return this.watchModuleSpaceItems<Dbo2>(space.id, queryArgs).pipe(
			map((items) => items.map((item) => ({ ...item, space }))),
		);
	}

	public watchModuleSpaceItems<Dbo2 extends Dbo>(
		spaceID: string,
		queryArgs?: IQueryArgs,
	): Observable<IIdAndBriefAndDbo<Brief, Dbo2>[]> {
		console.log('watchModuleSpaceItems()', spaceID, this.collectionName);
		// filter = [
		// 	...(filter || []),
		// 	// { field: 'teamIDs', operator: '==', value: teamID },
		// ];
		const collectionRef = this.collectionRef<Dbo2>(spaceID);
		return this.queryItems<Dbo2>(collectionRef, queryArgs);
	}

	// private readonly mapItemTeamItemContext = <
	//   Brief2 extends Brief,
	//   Dbo2 extends Dto,
	// >(
	//   team: ITeamContext,
	//   item: IIdAndBrief<Brief2, Dbo2>,
	// ) => {
	//   return querySnapshot.docs.map((docSnapshot) => {
	//     const dto = docSnapshot.data();
	//     const { id } = docSnapshot;
	//     const brief: Brief2 = { id, ...dto } as unknown as Brief2;
	//     const c: ITeamItemContext<Brief2, Dbo2> = { id, team, dto, brief };
	//     return c;
	//   });
	// };

	// public watchTeamItems<Brief2 extends Brief, Dbo2 extends Dto>(
	//   spaceID: string,
	//   filter?: readonly IFilter[],
	// ): Observable<IIdAndBriefAndDto<Brief2, Dbo2>[]> {
	//   console.log('watchTeamItems()', spaceID, this.collectionName);
	//   const collectionRef = collection(
	//     this.teamRef(spaceID),
	//     this.collectionName,
	//   );
	//   const querySnapshots = this.sfs.watchSnapshotsByFilter<Dbo2>(
	//     collectionRef as CollectionReference<Dbo2>,
	//     filter || [],
	//   );
	//   return querySnapshots.pipe(
	//     map(a => this.mapQueryItem(a)),
	//   );
	// }

	// public watchTeamItemsWithTeamContext<Brief2 extends Brief, Dbo2 extends Dto>(
	//   team: ITeamRef,
	//   filter?: readonly IFilter[],
	// ): Observable<ITeamItemContext<Brief2, Dbo2>[]> {
	//   const querySnapshots = this.watchTeamItems(team.id, filter);
	//   return querySnapshots.pipe(
	//     map((querySnapshot) =>
	//       this.mapItemTeamItemContext(
	//         team,
	//         querySnapshot as unknown as QuerySnapshot<Dbo2>,
	//       ),
	//     ),
	//   );
	// }
}
