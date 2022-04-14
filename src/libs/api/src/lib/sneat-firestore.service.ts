import { AngularFirestore } from '@angular/fire/compat/firestore';
import { INavContext } from '@sneat/core';
import { map, Observable, throwError } from 'rxjs';

export interface IFilter {
	field: string;
	operator: 'array-contains';
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
		console.log(`watchByID(${this.collection}/${id})`);
		return this.afs
			.collection<Dto2>(this.collection)
			.doc(id)
			.snapshotChanges()
			.pipe(
				map(changes => {
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
		return this.afs
			.collection<Dto2>(this.collection,
				ref => {
					let cond = ref.where(filter[0].field, 'array-contains', filter[0].value);
					for (let i = 1; i < filter.length; i++) {
						const f = filter[i];
						cond = cond.where(f.field, f.operator, f.value);
					}
					return cond;
				},
			)
			.snapshotChanges()
			.pipe(
				map(changes => {
					return changes.map(doc => {
						const { id } = doc.payload.doc;
						const dto: Dto2 = doc.payload.doc.data();
						const result: INavContext<Brief, Dto2> = {
							id, dto,
							brief: this.dto2brief(id, dto),
						};
						return result;
					});
				}),
			);
	}

	watchByTeamID<Dto2 extends Dto>(teamID: string, field: 'teamID' | 'teamIDs' = 'teamIDs'): Observable<INavContext<Brief, Dto2>[]> {
		console.log(`watchByTeamID(${this.collection}[${field}=${teamID})`);
		const filter: IFilter[] = [{ field, operator: 'array-contains', value: teamID }];
		return this.watchByFilter<Dto2>(filter);
	}
}
