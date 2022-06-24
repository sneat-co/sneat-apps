import { AngularFirestore, DocumentChangeAction, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { INavContext } from '@sneat/core';
import firebase from 'firebase/compat';
import { map, Observable, throwError } from 'rxjs';
import WhereFilterOp = firebase.firestore.WhereFilterOp;

export interface IFilter {
	field: string;
	operator: WhereFilterOp;
	value: any;
}

export class SneatFirestoreService<Brief, Dto> {
	constructor(
		private readonly collection: string,
		private readonly afs: AngularFirestore,
		private readonly dto2brief: (id: string, dto: Dto) => Brief,
	) {
	}

	watchByID<Dto2 extends Dto>(id: string): Observable<INavContext<Brief, Dto2>> {
		console.log(`SneatFirestoreService.watchByID(${this.collection}/${id})`);
		return this.afs
			.collection<Dto2>(this.collection)
			.doc(id)
			.snapshotChanges()
			.pipe(
				map(changes => {
					console.log(`SneatFirestoreService.watchByID(${this.collection}/${id}) => changes:`, changes);
					if (!changes.payload.exists) {
						return { id, dto: null };
					}
					const dto: Dto2 = changes.payload.data();
					const result: INavContext<Brief, Dto2> = {
						id, dto,
						brief: this.dto2brief(id, dto),
					};
					return result;
				}),
			);
	}

	watchByFilter<Dto2 extends Dto>(filter: IFilter[]): Observable<INavContext<Brief, Dto2>[]> {
		if (!filter || filter.length === 0) {
			return throwError(() => 'requires at least 1 element in filter');
		}
		console.log('watchByFilter()', this.collection, filter);
		const operator = (f: IFilter) => f.field.endsWith('IDs') ? 'array-contains' : f.operator
		return this.afs
			.collection<Dto2>(this.collection,
				ref => {
					let cond = ref.where(filter[0].field, operator(filter[0]), filter[0].value);
					for (let i = 1; i < filter.length; i++) {
						const f = filter[i];
						cond = cond.where(f.field, operator(f), f.value);
					}
					return cond;
				},
			)
			.snapshotChanges()
			.pipe(
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

	watchByTeamID<Dto2 extends Dto>(teamID: string, field: 'teamID' | 'teamIDs' = 'teamIDs'): Observable<INavContext<Brief, Dto2>[]> {
		if (!teamID) {
			throw new Error('!teamID');
		}
		if (!field) {
			throw new Error('!field');
		}
		const operator = field === 'teamID' ? '==' : 'array-contains';
		console.log(`SneatFirestoreService.watchByTeamID(${this.collection}[${field} ${operator} ${teamID})`);
		const filter: IFilter[] = [{ field, operator, value: teamID }];
		return this.watchByFilter<Dto2>(filter);
	}
}
