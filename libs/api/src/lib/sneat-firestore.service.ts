import {
	doc,
	getDoc,
	CollectionReference,
	DocumentReference,
	DocumentSnapshot,
	query,
	where,
	onSnapshot,
} from '@angular/fire/firestore';
import { IIdAndOptionalBriefAndOptionalDto } from '@sneat/core';
import { QuerySnapshot, QueryOrderByConstraint } from 'firebase/firestore';
import { WhereFilterOp } from '@firebase/firestore-types';
import { INavContext } from '@sneat/core';
import { from, map, Observable, Subject, tap } from 'rxjs';

export interface IFilter {
	field: string;
	operator: WhereFilterOp;
	value: unknown;
}

export class SneatFirestoreService<Brief, Dto extends Brief> {
	constructor(
		// private readonly afs: AngularFirestore,
		private readonly dto2brief: (id: string, dto: Dto) => Brief = (
			id: string,
			dto: Dto,
		) => ({
			...(dto as unknown as Brief),
			id,
		}),
	) {
		if (!dto2brief) {
			throw new Error('dto2brief is required');
		}
	}

	watchByID<Dto2 extends Dto>(
		collection: CollectionReference<Dto2>,
		id: string,
	): Observable<IIdAndOptionalBriefAndOptionalDto<Brief, Dto2>> {
		return this.watchByDocRef(doc(collection, id));
	}

	watchByDocRef<Dto2 extends Dto>(
		docRef: DocumentReference<Dto2>,
	): Observable<IIdAndOptionalBriefAndOptionalDto<Brief, Dto2>> {
		console.log(`SneatFirestoreService.watchByDocRef(${docRef.path})`, docRef);
		const subj = new Subject<DocumentSnapshot<Dto2>>();
		// const snapshots = docSnapshots<Dto2>(docRef);
		onSnapshot(
			docRef,
			(snapshot) => subj.next(snapshot),
			(err) => subj.error(err),
			() => subj.complete(),
		);
		// const snapshots = from(getDoc<Dto2>(docRef));
		return subj.asObservable().pipe(
			tap((snapshot) =>
				console.log(
					`SneatFirestoreService.watchByDocRef(${docRef.path}): snapshot:`,
					snapshot,
				),
			),
			map((changes) =>
				docSnapshotToDto<Brief, Dto2>(docRef.id, this.dto2brief, changes),
			),
		);
	}

	getByDocRef<Dto2 extends Dto>(
		docRef: DocumentReference<Dto2>,
	): Observable<INavContext<Brief, Dto2>> {
		console.log(`SneatFirestoreService.watchByDocRef(${docRef.path})`);
		return from(getDoc(docRef)).pipe(
			map((changes) =>
				docSnapshotToDto<Brief, Dto2>(docRef.id, this.dto2brief, changes),
			),
		);
	}

	watchSnapshotsByFilter<Dto2 extends Dto>(
		collectionRef: CollectionReference<Dto2>,
		filter: readonly IFilter[],
		orderBy?: readonly QueryOrderByConstraint[],
	): Observable<QuerySnapshot<Dto2>> {
		const operator = (f: IFilter) =>
			f.field.endsWith('IDs') ? 'array-contains' : f.operator;
		const q = query(
			collectionRef,
			...filter.map((f) => where(f.field, operator(f), f.value)),
			...(orderBy || []),
		);
		console.log(
			'watchSnapshotsByFilter()',
			collectionRef.path,
			'filter',
			filter,
			'query',
			q,
		);
		const subj = new Subject<QuerySnapshot<Dto2>>();
		onSnapshot(q, subj);
		return subj;
	}

	watchByFilter<Dto2 extends Dto>(
		collectionRef: CollectionReference<Dto2>,
		filter: IFilter[],
		orderBy?: QueryOrderByConstraint[],
	): Observable<INavContext<Brief, Dto2>[]> {
		return this.watchSnapshotsByFilter(collectionRef, filter, orderBy).pipe(
			map((querySnapshot) => {
				console.log(
					'watchByFilter() => querySnapshot: ',
					querySnapshot,
					querySnapshot.docs,
				);
				return querySnapshot.docs.map(this.docSnapshotToContext.bind(this));
			}),
		);
	}

	docSnapshotsToContext<Dto2 extends Dto>(
		docSnapshots: DocumentSnapshot<Dto2>[],
	): INavContext<Brief, Dto2>[] {
		return docSnapshots.map((doc) => {
			return this.docSnapshotToContext(doc);
		});
	}

	docSnapshotToContext<Dto2 extends Dto>(
		doc: DocumentSnapshot<Dto2>,
	): INavContext<Brief, Dto2> {
		const { id } = doc;
		const dto: Dto2 | undefined = doc.data();
		const brief = dto && this.dto2brief(id, dto);
		return {
			id,
			dto,
			brief,
		} as unknown as INavContext<Brief, Dto2>; // TODO: try to remove this cast
	}
}

export function docSnapshotToDto<Brief, Dto extends Brief>(
	id: string,
	dto2brief: (id: string, dto: Dto) => Brief,
	docSnapshot: DocumentSnapshot<Dto>,
): INavContext<Brief, Dto> {
	if (!docSnapshot.exists) {
		return { id, brief: null, dto: null };
	}
	const dto: Dto | undefined = docSnapshot.data();
	return { id, dto, brief: dto ? dto2brief(id, dto) : undefined };
}
