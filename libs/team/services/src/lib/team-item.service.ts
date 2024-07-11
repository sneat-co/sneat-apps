import {
	Firestore as AngularFirestore,
	doc,
	collection,
	CollectionReference,
} from '@angular/fire/firestore';
import { QuerySnapshot } from '@firebase/firestore-types';
import { IQueryArgs, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IIdAndBriefAndDto } from '@sneat/core';
import { ISpaceDbo } from '@sneat/dto';
import {
	ISpaceContext,
	ISpaceItemNavContext,
	ISpaceItemWithBriefAndDbo,
	ISpaceRef,
	ISpaceRequest,
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

	protected abstract collectionRef<Dto2 extends Dbo>(
		teamID: string,
	): CollectionReference<Dto2>;

	public watchTeamItemByIdWithTeamRef<Dto2 extends Dbo>(
		space: ISpaceRef,
		itemID: string,
	): Observable<ISpaceItemNavContext<Brief, Dto2>> {
		console.log(
			`TeamItemBaseService.watchTeamItemByIdWithTeamRef(team=${space.id}, itemID=${itemID}), collectionName=${this.collectionName}`,
		);
		const collectionRef = this.collectionRef<Dto2>(space.id);
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

	protected queryItems<Dto2 extends Dbo>(
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

	protected mapQueryItem<Dto2 extends Dbo>(
		querySnapshot: QuerySnapshot<Dto2>,
	): IIdAndBriefAndDto<Brief, Dto2>[] {
		return querySnapshot.docs.map((docSnapshot) => {
			const dto = docSnapshot.data();
			const { id } = docSnapshot;
			const brief: Brief = dto;
			return { id, brief, dbo: dto };
		});
	}

	public deleteTeamItem<Response>(
		endpoint: string,
		request: ISpaceRequest,
	): Observable<Response> {
		return this.sneatApiService.delete<Response>(endpoint, undefined, request);
	}

	public createSpaceItem<Brief, Dbo extends Brief>(
		endpoint: string,
		space: ISpaceContext,
		request: ISpaceRequest,
	): Observable<ISpaceItemWithBriefAndDbo<Brief, Dbo>> {
		console.log(`TeamItemBaseService.createSpaceItem()`, request);
		return this.sneatApiService
			.post<ICreateSpaceItemResponse<Brief, Dbo>>(endpoint, request)
			.pipe(
				map((response) => {
					if (!response) {
						throw new Error('create space item response is empty');
					}
					if (!response.id) {
						throw new Error('create space item response have no ID');
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
		Dto2 extends Dbo,
	>(): CollectionReference<Dto2> {
		return collection(
			this.afs,
			this.collectionName,
		) as CollectionReference<Dto2>;
	}

	public watchGlobalItems<Dto2 extends Dbo>(
		queryArgs: IQueryArgs,
	): Observable<IIdAndBriefAndDto<Brief, Dto2>[]> {
		console.log('watchGlobalItems()', this.collectionName);
		const collectionRef = this.collectionRef<Dto2>();
		return this.queryItems<Dto2>(collectionRef, queryArgs);
	}

	public watchGlobalTeamItemsWithTeamRef<Dto2 extends Dbo>(
		space: ISpaceRef,
		queryArgs: IQueryArgs,
	): Observable<ISpaceItemWithBriefAndDbo<Brief, Dto2>[]> {
		return this.watchGlobalTeamItems<Dto2>(space.id, queryArgs).pipe(
			map((items) => items.map((item) => ({ ...item, space }))),
		);
	}

	public watchGlobalTeamItems<Dto2 extends Dbo>(
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

// intentionally not abstract
export class ModuleSpaceItemService<
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

	// protected teamCollection(teamID: string): AngularFirestoreCollection<ITeamDto> {
	// 	return this.afs.collection('spaces');
	// }

	protected override collectionRef<Dto2 extends Dbo>(
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

	public watchModuleTeamItem<Dto2 extends Dbo>(
		team: ISpaceRef,
		itemID: string,
	): Observable<IIdAndBriefAndDto<Brief, Dto2>[]> {
		console.log(team, itemID);
		throw new Error('Method not implemented.');
	}

	public watchModuleTeamItemsWithTeamRef<Dto2 extends Dbo>(
		space: ISpaceRef,
		queryArgs?: IQueryArgs,
	): Observable<ISpaceItemWithBriefAndDbo<Brief, Dto2>[]> {
		return this.watchModuleTeamItems<Dto2>(space.id, queryArgs).pipe(
			map((items) => items.map((item) => ({ ...item, space }))),
		);
	}

	public watchModuleTeamItems<Dto2 extends Dbo>(
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
