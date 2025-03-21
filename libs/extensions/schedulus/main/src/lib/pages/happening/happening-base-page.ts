import { IHappeningContext } from '@sneat/mod-schedulus-core';
import {
	distinctUntilChanged,
	map,
	Subject,
	Subscription,
	takeUntil,
} from 'rxjs';
import { CalendarBasePage } from '../calendar-base-page';
import { HappeningComponentBaseParams } from '@sneat/extensions-schedulus-shared';

export abstract class HappeningBasePage extends CalendarBasePage {
	private readonly happeningID$ = new Subject<string>();
	protected happening?: IHappeningContext;

	// private calendariumSpaceDbo?: ICalendariumSpaceDbo | null;
	private calendariumSpaceSub?: Subscription;

	protected constructor(
		className: string,
		protected readonly params: HappeningComponentBaseParams, // 	HappeningModuleSchema,
	) {
		// 	typeof SingleHappeningKind | typeof RegularHappeningKind>,
		super(className);
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
		this.spaceChanged$.subscribe({
			next: (space) => {
				if (space && this.happening) {
					this.setHappening(
						{ ...this.happening, space: space },
						'spaceChanged$',
					);
				} else if (!space) {
					this.happening = undefined;
				}
			},
		});
	}

	override onSpaceIdChanged(): void {
		super.onSpaceIdChanged();
		this.calendariumSpaceSub?.unsubscribe();
		this.calendariumSpaceSub = this.params.calendariumSpaceService
			.watchSpaceModuleRecord(this.space.id)
			.subscribe({
				next: (calendariumSpace) => {
					const happening = this.happening;
					if (
						happening?.id &&
						!happening?.dbo // If we loaded happening record we use it as a brief and ignore the brief from calendariumSpace
					) {
						const brief =
							calendariumSpace.dbo?.recurringHappenings?.[happening?.id];
						if (brief) {
							this.setHappening(
								{ ...happening, brief },
								'calendariumSpaceDbo changed',
							);
						}
					}
				},
			});
	}

	protected readonly setHappening = (
		happening: IHappeningContext,
		from: string,
	): void => {
		console.log(`${this.className}.setHappening(from=${from})`, happening);
		if (!happening.dbo && this.happening?.brief) {
			this.happening = { ...happening, brief: this.happening.brief };
		}
		this.happening = happening;
		if (!this.space?.id && this.happening.space) {
			this.$spaceContext.set(this.happening.space);
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
		const space = this.space;
		if (!space) {
			console.error('Space is not defined');
		}
		this.setHappening({ id, space }, 'url');
		this.watchHappeningChanges(id);
	};

	private watchHappeningChanges(id: string): void {
		const space = this.space;
		if (!space?.id) {
			console.warn('watchHappeningChanges: space is not defined');
			return;
		}
		try {
			this.params.happeningService
				.watchHappeningByID(space, id)
				.pipe(this.takeUntilDestroyed(), takeUntil(this.happeningID$))
				.subscribe({
					next: (happening) => {
						// This can be called twice - first for `snapshot.type=added`, then `snapshot.type=modified`
						console.log(
							'onHappeningIDChanged => watchHappeningByID => happening:',
							happening,
						);
						if (happening.id === this.happening?.id) {
							this.setHappening(
								happening,
								'watchHappeningChanges() => watchHappeningByID',
							);
						}
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
				this.takeUntilDestroyed(),
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
