import {IDatatugStoreService} from './datatug-store.service.interface';
import {Observable, throwError} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class DatatugStoreFirestoreService implements IDatatugStoreService {

	constructor(
		private readonly db: AngularFirestore,
	) {
	}

	watchProjectItem<T>(projectId: string, path?: string): Observable<T | null> {
		if (path && !path.startsWith('/')) {
			return throwError('path should start with a "/", got: ' + path);
		}
		path = `datatug_projects/${projectId}${path || ''}`;
		return this.db.doc(path).snapshotChanges().pipe(map(changes => {
			if (changes.type === 'deleted') {
				return null;
			}
			if (changes.type)
				return changes.payload.data() as T;
		}));
	}
}
