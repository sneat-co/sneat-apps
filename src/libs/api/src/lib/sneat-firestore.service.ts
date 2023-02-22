import {
	Action,
	AngularFirestore,
	AngularFirestoreCollection, CollectionReference,
	DocumentChangeAction,
	DocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { INavContext } from '@sneat/core';
import firebase from 'firebase/compat';
import { map, Observable } from 'rxjs';
import WhereFilterOp = firebase.firestore.WhereFilterOp;

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
		collection: AngularFirestoreCollection<Dto2>,
		id: string,
	): Observable<INavContext<Brief, Dto2>> {
		console.log(`SneatFirestoreService.watchByID(${this.collection}/${id})`);
		return collection.doc(id)
			.snapshotChanges()
			.pipe(
				map(changes => docSnapshotToDto(id, this.dto2brief, changes)),
			);
	}

	watchSnapshotsByFilter<Dto2 extends Dto>(collectionRef: CollectionReference<Dto2>, filter: IFilter[]) {
		console.log('watchByFilter()', this.collection, filter);

		const operator = (f: IFilter) => f.field.endsWith('IDs') ? 'array-contains' : f.operator;

		const query = this.afs.collection<Dto2>(
			collectionRef as CollectionReference, // TODO: Ask StackOverflow: what is proper way instead of dumb forced cast?
			ref => {
				let cond = ref.where(filter[0].field, operator(filter[0]), filter[0].value);
				for (let i = 1; i < filter.length; i++) {
					const f = filter[i];
					cond = cond.where(f.field, operator(f), f.value);
				}
				return cond;
			},
		)
			;
		return query.snapshotChanges();
	}

	watchByFilter<Dto2 extends Dto>(collectionRef: CollectionReference<Dto2>, filter: IFilter[]): Observable<INavContext<Brief, Dto2>[]> {
		return this.watchSnapshotsByFilter(collectionRef, filter).pipe(
			map(changes => {
				return this.snapshotChangesToContext(changes);
			}),
		);
	}

	snapshotChangesToContext<Dto2 extends Dto>(changes: DocumentChangeAction<Dto2>[]) {
		return changes.map(doc => {
			return this.snapshotChangeToContext(doc);
		});
	}

	snapshotChangeToContext<Dto2 extends Dto>(doc: DocumentChangeAction<Dto2>) {
		const { id } = doc.payload.doc;
		const dto: Dto2 = doc.payload.doc.data();
		const result: INavContext<Brief, Dto2> = {
			id, dto,
			brief: this.dto2brief(id, dto),
		};
		return result;
	}

	docSnapshotToContext<Dto2 extends Dto>(doc: DocumentSnapshot<Dto2>): INavContext<Brief, Dto2> {
		const { id } = doc;
		const dto: Dto2 | undefined = doc.data();
		const result: INavContext<Brief, Dto2> = {
			id, dto,
			brief: dto && this.dto2brief(id, dto),
		};
		return result;
	}
}

export function docSnapshotToDto<Brief extends { id: string }, Dto>(
	id: string,
	dto2brief: (id: string, dto: Dto) => Brief,
	changes: Action<DocumentSnapshot<Dto>>,
): INavContext<Brief, Dto> {
	if (!changes.payload.exists) {
		return { id, dto: null };
	}
	const dto: Dto = changes.payload.data();
	return { id, dto, brief: dto2brief(id, dto) };
}
