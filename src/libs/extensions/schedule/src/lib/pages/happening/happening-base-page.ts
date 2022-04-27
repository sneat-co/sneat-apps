import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent } from '@sneat/team/components';
import { IHappeningContext } from '@sneat/team/models';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { HappeningComponentBaseParams } from '../../components/happening-component-base-params';

export abstract class HappeningBasePage extends TeamBaseComponent {

	private readonly happeningID$ = new Subject<string>();
	public happening?: IHappeningContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		protected readonly params: HappeningComponentBaseParams,
		// 	HappeningModuleSchema,
		// 	typeof SingleHappeningKind | typeof RegularHappeningKind>,
	) {
		super(className, route, params.teamParams);
		const happening = window.history.state.happening as unknown as IHappeningContext;
		if (happening) {
			this.setHappening(happening, 'history.state');
			this.watchHappeningChanges(happening.id);
		}
		this.trackHappeningIDFromUrl();
	}

	protected readonly setHappening = (happening: IHappeningContext, from: string): void => {
		console.log(`${this.className}.setHappening(from=${from})`, happening);
		this.happening = happening;
	};

	private readonly onHappeningIDChanged = (id: string): void => {
		if (!id) {
			this.happening = undefined;
			return;
		}
		if (this.happening?.id === id) {
			return;
		}
		this.setHappening({ id }, 'url');
		this.watchHappeningChanges(id);
	};

	private watchHappeningChanges(id: string): void {
		this.params.happeningService.watchHappeningByID(id)
			.pipe(
				this.takeUntilNeeded(),
				takeUntil(this.happeningID$),
			)
			.subscribe({
				next: happening => {
					// This can be called twice - first for `snapshot.type=added`, then `snapshot.type=modified`
					// console.log('onHappeningIDChanged => watchHappeningByID => happening:', happening);
					this.setHappening(happening, 'watchHappeningByID');
				},
				error: this.logErrorHandler('failed to get happening by ID'),
			});
	}

	private trackHappeningIDFromUrl(): void {
		this.route?.params.pipe(
			this.takeUntilNeeded(),
			map(params => params['happeningID']),
			distinctUntilChanged(),
		).subscribe(this.happeningID$);
		this.happeningID$
			.subscribe({
				next: this.onHappeningIDChanged,
			});
	}
}
