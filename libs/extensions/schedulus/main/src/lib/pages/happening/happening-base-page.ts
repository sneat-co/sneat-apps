import { ActivatedRoute } from '@angular/router';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { HappeningComponentBaseParams } from '../../components/happening-component-base-params';
import { ScheduleBasePage } from '../schedule-base-page';

export abstract class HappeningBasePage extends ScheduleBasePage {
	private readonly happeningID$ = new Subject<string>();
	public happening?: IHappeningContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		protected readonly params: HappeningComponentBaseParams, // 	HappeningModuleSchema,
	) {
		// 	typeof SingleHappeningKind | typeof RegularHappeningKind>,
		super(className, route, params.teamParams);
		try {
			const happening = window.history.state
				.happening as unknown as IHappeningContext;
			if (happening) {
				this.happeningID$.next(happening.id);
				this.setHappening(happening, 'history.state');
				this.watchHappeningChanges(happening.id);
			}
			this.trackHappeningIDFromUrl();
		} catch (e) {
			console.error(
				`Failed in ${this.className}.HappeningBasePage.constructor()`,
				e,
			);
		}
	}

	protected readonly setHappening = (
		happening: IHappeningContext,
		from: string,
	): void => {
		console.log(`${this.className}.setHappening(from=${from})`, happening);
		this.happening = happening;
		if (!this.team?.id && this.happening.team) {
			this.teamContext = this.happening.team;
		}
	};

	private readonly onHappeningIDChanged = (id?: string): void => {
		if (!id) {
			this.happening = undefined;
			return;
		}
		if (this.happening?.id === id) {
			return;
		}
		const team = this.team;
		if (!team) {
			throw new Error('Team is not defined');
		}
		this.setHappening({ id, team }, 'url');
		this.watchHappeningChanges(id);
	};

	private watchHappeningChanges(id: string): void {
		const team = this.team;
		if (!team?.id) {
			// console.warn('watchHappeningChanges: team is not defined');
			return;
		}
		try {
			this.params.happeningService
				.watchHappeningByID(team, id)
				.pipe(this.takeUntilNeeded(), takeUntil(this.happeningID$))
				.subscribe({
					next: (happening) => {
						// This can be called twice - first for `snapshot.type=added`, then `snapshot.type=modified`
						// console.log('onHappeningIDChanged => watchHappeningByID => happening:', happening);
						this.setHappening(
							happening,
							'watchHappeningChanges() => watchHappeningByID',
						);
					},
					error: this.logErrorHandler('failed to get happening by ID'),
				});
		} catch (e) {
			console.error(
				`Failed in ${this.className}.watchHappeningChanges(id=${id})`,
				e,
			);
		}
	}

	private trackHappeningIDFromUrl(): void {
		this.route?.params
			.pipe(
				this.takeUntilNeeded(),
				map((params) => params['happeningID']),
				distinctUntilChanged(),
			)
			.subscribe({
				next: (happeningID) => {
					if (this.happening?.id !== happeningID) {
						this.happeningID$.next(happeningID);
					}
				},
			});
		this.happeningID$.pipe(distinctUntilChanged()).subscribe({
			next: this.onHappeningIDChanged,
		});
	}
}
