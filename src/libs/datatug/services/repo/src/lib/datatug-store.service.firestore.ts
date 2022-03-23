import { IDatatugStoreService } from './datatug-store.service.interface';
import { Observable, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { IProjectSummary } from '@sneat/datatug/models';

@Injectable({ providedIn: 'root' })
export class DatatugStoreFirestoreService implements IDatatugStoreService {
	constructor(private readonly db: AngularFirestore) {
	}

	getProjectSummary(projectId: string): Observable<IProjectSummary> {
		return throwError(() => 'not implemented');
	}

	watchProjectItem<T>(projectId: string, path?: string): Observable<T | null | undefined> {
		if (path && !path.startsWith('/')) {
			return throwError(() => 'path should start with a "/", got: ' + path);
		}
		path = `datatug_projects/${projectId}${path || ''}`;
		return this.db
			.doc(path)
			.snapshotChanges()
			.pipe(
				map((changes) => {
					if (changes.type === 'deleted') {
						return null;
					}
					if (changes.type)
						return changes.payload.data() as T;
					return undefined;
				}),
			);
	}
}
