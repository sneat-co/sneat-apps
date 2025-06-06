import { IDatatugStoreService } from './datatug-store.service.interface';
import { Observable, throwError } from 'rxjs';
import {
	doc,
	docSnapshots,
	Firestore as AngularFirestore,
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { IProjectSummary } from '@sneat/ext-datatug-models';

@Injectable()
export class DatatugStoreFirestoreService implements IDatatugStoreService {
	private readonly db = inject(AngularFirestore);

	getProjectSummary(projectId: string): Observable<IProjectSummary> {
		return throwError(() => 'not implemented ' + projectId);
	}

	watchProjectItem<T>(
		projectId: string,
		path?: string,
	): Observable<T | null | undefined> {
		if (path && !path.startsWith('/')) {
			return throwError(() => 'path should start with a "/", got: ' + path);
		}
		path = `datatug_projects/${projectId}${path || ''}`;
		const d = doc(this.db, path);

		return docSnapshots(d).pipe(
			map((changes) => {
				if (!changes.exists()) {
					return null;
				}
				return changes.data() as unknown as T;
			}),
		);
	}
}
