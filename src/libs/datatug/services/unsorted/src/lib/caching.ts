import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {IDatatugProjRef} from '@sneat/datatug/core';

export class ProjectItemsByAgent<T> {
	// private readonly byAgent: {[repo: string]: {[id: string]: T[]}} = {};
	public readonly byRepo$: { [repo: string]: { [id: string]: BehaviorSubject<T[]> } } = {};

	public getItems$(from: IDatatugProjRef): Observable<T[]> {
		const {repoId, projectId} = from;
		console.log('getItems$', repoId, projectId, this.byRepo$);
		const a = this.byRepo$[repoId];
		return a && this.asObservable(a[projectId]);
	}

	public setItems$(to: IDatatugProjRef, items: Observable<T[]>): Observable<T[]> {
		const {repoId, projectId} = to;
		let a = this.byRepo$[repoId];
		if (!a) {
			this.byRepo$[repoId] = a = {};
		}
		const subject = new BehaviorSubject<T[]>(undefined);
		a[projectId] = subject;
		items.subscribe({
			next: value => subject.next(value),
			error: err => subject.error(err),
		});
		return this.asObservable(subject);
	}

	private asObservable(o: BehaviorSubject<T[]>) {
		return o.asObservable().pipe(filter(v => v !== undefined));
	}
}
