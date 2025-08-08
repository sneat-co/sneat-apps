import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { routingParamProjectId } from '../../../core/datatug-routing-params';
import {
	equalProjectRef,
	IProjectRef,
	isValidProjectRef,
} from '../../../core/project-context';
import { IProjectContext } from '../../../nav/nav-models';
import { StoreTracker } from './store.tracker';
import {
	distinctUntilChanged,
	filter,
	map,
	startWith,
	takeUntil,
} from 'rxjs/operators';

export class ProjectTracker {
	public readonly storeTracker: StoreTracker;

	public readonly projectId: Observable<string>;
	public readonly projectRef: Observable<IProjectRef>;

	constructor(
		readonly stopNotifier: Observable<unknown>,
		readonly route: ActivatedRoute,
	) {
		if (!stopNotifier) {
			throw new Error(
				'stopNotifier is a required parameter for ProjectTracker',
			);
		}
		if (!route) {
			throw new Error('route is a required parameter for StoreTracker');
		}
		this.storeTracker = new StoreTracker(stopNotifier, route);
		this.projectId = route.paramMap.pipe(
			takeUntil(stopNotifier),
			map((paramMap) => paramMap.get(routingParamProjectId) || ''),
		);
		this.projectRef = combineLatest([
			this.storeTracker.storeId,
			this.projectId,
		]).pipe(
			filter(([storeId, projectId]) => !!storeId && !!projectId),
			map(([storeId, projectId]) => ({ storeId: storeId || '', projectId })),
		);
		const project = window.history.state.project as IProjectContext;
		if (isValidProjectRef(project?.ref)) {
			this.projectRef = this.projectRef.pipe(startWith(project.ref));
		}
		this.projectRef = this.projectRef.pipe(
			distinctUntilChanged(equalProjectRef),
		);
	}
}
