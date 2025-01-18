import {
	Component,
	Inject,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { dateToIso } from '@sneat/core';
import {
	CalendarDayService,
	CalendariumSpaceService,
	HappeningService,
} from '../../services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICalendariumSpaceDbo,
	IHappeningWithUiState,
} from '@sneat/mod-schedulus-core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/team-models';
import { Subject, Subscription } from 'rxjs';
import { SpaceDaysProvider } from '../../services/space-days-provider';

@Component({
	template: '',
})
export abstract class CalendarBaseComponent implements OnChanges, OnDestroy {
	protected _space?: ISpaceContext;

	protected readonly destroyed = new Subject<void>();
	protected date = new Date();

	public readonly spaceDaysProvider: SpaceDaysProvider;

	private schedulusSpaceDbo?: ICalendariumSpaceDbo | null;

	private schedulusSpaceSubscription?: Subscription;

	protected allRecurrings?: readonly IHappeningWithUiState[];

	constructor(
		@Inject(ErrorLogger) protected readonly errorLogger: IErrorLogger,
		private readonly calendariumSpaceService: CalendariumSpaceService,
		happeningService: HappeningService,
		calendarDayService: CalendarDayService,
		sneatApiService: SneatApiService,
	) {
		this.spaceDaysProvider = new SpaceDaysProvider(
			this.errorLogger,
			happeningService,
			calendarDayService,
			sneatApiService,
		);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
		this.spaceDaysProvider.destroy();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['space']) {
			this.onSpaceContextChanged();
			const spaceChange = changes['space'];
			const prevSpace = spaceChange.previousValue as ISpaceContext;
			const currentSpace = spaceChange.currentValue as ISpaceContext;
			if (currentSpace?.id !== prevSpace?.id) {
				this.onSpaceIdChanged();
			}
		}
	}

	protected populateRecurrings(): void {
		const prevAll = this.allRecurrings;
		this.allRecurrings =
			zipMapBriefsWithIDs(
				this.schedulusSpaceDbo?.recurringHappenings || {},
			)?.map((rh) => {
				const { id } = rh;
				const prev = prevAll?.find((p) => p.id === id);
				const result: IHappeningWithUiState = {
					id,
					brief: rh.brief,
					state: prev?.state || {},
					space: this._space || { id: '' },
				};
				return result;
			}) || [];
		this.onRecurringsLoaded();
	}

	protected abstract onRecurringsLoaded(): void;

	private onSpaceIdChanged(): void {
		console.log('ScheduleComponent.onSpaceIdChanged()', this._space?.id);
		this.schedulusSpaceSubscription?.unsubscribe();
		const space = this._space;
		if (!space) {
			return;
		}
		this.populateRecurrings();
		this.setDay('onTeamDtoChanged', this.date);
		this.schedulusSpaceSubscription = this.calendariumSpaceService
			.watchSpaceModuleRecord(space.id)
			.subscribe({
				next: (schedulusTeam) => {
					console.log(
						'ScheduleComponent.onTeamIdChanged() => schedulusTeam:',
						schedulusTeam,
					);
					this.schedulusSpaceDbo = schedulusTeam?.dbo;
					this.spaceDaysProvider.setSchedulusSpace({
						space,
						...schedulusTeam,
					});
					this.populateRecurrings();
				},
			});
		// this.slotsProvider.setCommuneId(this.team.id)
		// 	.subscribe(
		// 		(regulars) => {
		// 			console.log('Loaded regulars:', regulars);
		// 			this.allRegulars = regulars;
		// 			this.regulars = this.filterRegulars();
		// 		},
		// 		this.errorLogger.logError,
		// 		() => {
		// 			// this.activeWeek.weekdays = [...this.activeWeek.weekdays];
		// 			this.setDay('onCommuneIdChanged', this.activeDay.date || new Date());
		// 		},
		// 	);
	}

	private onSpaceContextChanged(): void {
		if (this._space) {
			this.spaceDaysProvider.setSpace(this._space);
		}
	}

	protected setDay(source: string, d: Date): void {
		console.log(
			`CalendarBaseComponent.setDay(source=${source}), date=${dateToIso(d)}`,
		);
		if (!d) {
			return;
		}
		this.onDayChanged(d);
	}

	protected abstract onDayChanged(d: Date): void;
}
