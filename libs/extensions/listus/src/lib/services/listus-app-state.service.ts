import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class LocalAppState<AppState> {
	protected readonly changed$: BehaviorSubject<AppState>;
	private readonly appStateKey: string = 'AppState';

	protected constructor(private readonly createState: () => AppState) {
		this.changed$ = new BehaviorSubject(this.loadAppState());
	}

	public get changed(): Observable<AppState> {
		return this.changed$.asObservable();
	}

	public getAppState(): AppState {
		return this.changed$.value || this.loadAppState();
	}

	protected saveAppState(appState: AppState): void {
		localStorage.setItem(this.appStateKey, JSON.stringify(appState));
	}

	private loadAppState(): AppState {
		const s = localStorage.getItem(this.appStateKey);
		if (s) {
			try {
				return JSON.parse(s as unknown as string);
			} catch (e) {
				console.error('Failed to parse app state', e);
			}
		}
		return this.createState();
	}
}

export interface IListusAppState {
	collapsedGroups: string[];
	showWatched: boolean;
}

export abstract class IListusAppStateService extends LocalAppState<IListusAppState> {
	abstract setGroupCollapsed(id: string, isCollapsed: boolean): void;

	abstract setShowWatched(showWatched: boolean): void;
}

@Injectable()
export class ListusAppStateService extends IListusAppStateService {
	constructor() {
		super(() => ({ collapsedGroups: [], showWatched: true }));
	}

	public setGroupCollapsed(id: string, isCollapsed: boolean): void {
		const appState = this.getAppState();
		if (isCollapsed) {
			if (!appState.collapsedGroups.includes(id)) {
				appState.collapsedGroups.push(id);
			}
		} else {
			const i = appState.collapsedGroups.indexOf(id);
			if (i >= 0) {
				appState.collapsedGroups.splice(i, 1);
			}
		}
		this.saveAppState(appState);
		this.changed$.next(appState);
	}

	public setShowWatched(showWatched: boolean): void {
		const appState: IListusAppState = {
			...this.getAppState(),
			showWatched,
		};
		this.saveAppState(appState);
		this.changed$.next(appState);
	}
}
