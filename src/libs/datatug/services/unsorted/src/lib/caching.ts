import { BehaviorSubject, EMPTY, Observable, ReplaySubject, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { IProjectRef } from "@sneat/datatug/core";

export class ProjectItemsByAgent<T> {
	// private readonly byAgent: {[store: string]: {[id: string]: T[]}} = {};
	public readonly byRepo$: {
		[repo: string]: { [id: string]: BehaviorSubject<T[]> };
	} = {};

	public getItems$(from: IProjectRef): Observable<T[]> {
		const { storeId, projectId } = from;
		console.log("getItems$", storeId, projectId, this.byRepo$);
		const a = this.byRepo$[storeId];
		return a ? this.asObservable(a[projectId]) : EMPTY;
	}

	public setItems$(to: IProjectRef, items: Observable<T[]>): Observable<T[]> {
		const { storeId, projectId } = to;
		let a = this.byRepo$[storeId];
		if (!a) {
			this.byRepo$[storeId] = a = {};
		}
		const subject = new BehaviorSubject<T[] >(undefined as unknown as T[]);
		a[projectId] = subject;
		items.subscribe({
			next: v => subject.next(v),
			error: err => subject.error(err)
		});
		return this.asObservable(subject) as Observable<T[]>;
	}

	private asObservable(o: Subject<T[]>) {
		return o.asObservable().pipe(
			filter(v => v !== undefined)
		);
	}
}
