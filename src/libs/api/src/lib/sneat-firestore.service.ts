import {
	doc,
	docSnapshots,
	getDoc,
	CollectionReference,
	DocumentReference,
	DocumentSnapshot,
	Firestore as AngularFirestore,
	query,
	where,
} from '@angular/fire/firestore';
import { onSnapshot, QuerySnapshot, QueryOrderByConstraint } from 'firebase/firestore';
import { WhereFilterOp } from '@firebase/firestore-types';
import { INavContext } from '@sneat/core';
import { from, map, Observable, Subject } from 'rxjs';

export interface IFilter {
	field: string;
	operator: WhereFilterOp;
	value: unknown;
}

export class SneatFirestoreService<Brief extends { id: string }, Dto> {

	constructor(
		private readonly collection: string,
		private readonly afs: AngularFirestore,
		private readonly dto2brief: (id: string, dto: Dto) => Brief = (id: string, dto: Dto) => ({
			...(dto as unknown as Brief),
			id,
		}),
	) {
	}

	watchByID<Dto2 extends Dto>(
		collection: CollectionReference<Dto2>,
		id: string,
	): Observable<INavContext<Brief, Dto2>> {
		return this.watchByDocRef(doc<Dto2>(collection, id));
	}

	watchByDocRef<Dto2 extends Dto>(docRef: DocumentReference<Dto2>): Observable<INavContext<Brief, Dto2>> {
		console.log(`SneatFirestoreService.watchByDocRef(${docRef.path})`);
		const snapshots = docSnapshots<Dto2>(docRef);
		return snapshots.pipe(
			map(changes => docSnapshotToDto<Brief, Dto2>(docRef.id, this.dto2brief, changes)),
		);
	}

	getByDocRef<Dto2 extends Dto>(docRef: DocumentReference<Dto2>): Observable<INavContext<Brief, Dto2>> {
		console.log(`SneatFirestoreService.watchByDocRef(${docRef.path})`);
		return from(getDoc<Dto2>(docRef)).pipe(
			map(changes => docSnapshotToDto<Brief, Dto2>(docRef.id, this.dto2brief, changes)),
		);
	}

	watchSnapshotsByFilter<Dto2 extends Dto>(collectionRef: CollectionReference<Dto2>, filter: IFilter[], orderBy?: QueryOrderByConstraint[]): Observable<QuerySnapshot<Dto2>> {
		console.log('watchSnapshotsByFilter()', this.collection, filter);
		const operator = (f: IFilter) => f.field.endsWith('IDs') ? 'array-contains' : f.operator;
		const q = query(collectionRef, ...filter.map(f => where(f.field, operator(f), f.value)), ...(orderBy || []));
		const subj = new Subject<QuerySnapshot<Dto2>>();
		onSnapshot<Dto2>(q, subj);
		return subj;
	}

	watchByFilter<Dto2 extends Dto>(collectionRef: CollectionReference<Dto2>, filter: IFilter[], orderBy?: QueryOrderByConstraint[]): Observable<INavContext<Brief, Dto2>[]> {
		return this.watchSnapshotsByFilter(collectionRef, filter, orderBy).pipe(
			map(querySnapshot => {
				return querySnapshot.docs.map(this.docSnapshotToContext);
			}),
		);
	}

	docSnapshotsToContext<Dto2 extends Dto>(docSnapshots: DocumentSnapshot<Dto2>[]): INavContext<Brief, Dto2>[] {
		return docSnapshots.map(doc => {
			return this.docSnapshotToContext(doc);
		});
	}

	docSnapshotToContext<Dto2 extends Dto>(doc: DocumentSnapshot<Dto2>): INavContext<Brief, Dto2> {
		const { id } = doc;
		const dto: Dto2 | undefined = doc.data();
		return {
			id, dto,
			brief: dto && this.dto2brief(id, dto),
		};
	}
}

export function docSnapshotToDto<Brief extends { id: string }, Dto>(
	id: string,
	dto2brief: (id: string, dto: Dto) => Brief,
	docSnapshot: DocumentSnapshot<Dto>,
): INavContext<Brief, Dto> {
	if (!docSnapshot.exists) {
		return { id, dto: null };
	}
	const dto: Dto | undefined = docSnapshot.data();
	return { id, dto, brief: dto ? dto2brief(id, dto) : undefined };
}
