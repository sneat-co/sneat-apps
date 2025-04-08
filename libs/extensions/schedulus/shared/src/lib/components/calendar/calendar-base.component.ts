import { Directive, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { dateToIso } from '@sneat/core';
import { WithSpaceInput } from '@sneat/space-components';
import { CalendarDayService } from '../../services/calendar-day.service';
import { CalendariumSpaceService } from '../../services/calendarium-space.service';
import { HappeningService } from '../../services/happening.service';
import {
	ICalendariumSpaceDbo,
	IHappeningWithUiState,
} from '@sneat/mod-schedulus-core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/space-models';
import { Subscription } from 'rxjs';
import { SpaceDaysProvider } from '../../services/space-days-provider';

@Directive()
export abstract class CalendarBaseComponent
	extends WithSpaceInput
	implements OnChanges, OnDestroy
{
	protected date = new Date();

	protected readonly spaceDaysProvider: SpaceDaysProvider;

	private schedulusSpaceDbo?: ICalendariumSpaceDbo | null;

	private schedulusSpaceSubscription?: Subscription;

	protected allRecurrings?: readonly IHappeningWithUiState[];

	protected constructor(
		className: string,
		private readonly calendariumSpaceService: CalendariumSpaceService,
		happeningService: HappeningService,
		calendarDayService: CalendarDayService,
		sneatApiService: SneatApiService,
	) {
		super(className);
		console.log(`${className}:CalendarBaseComponent.constructor()`);
		this.spaceDaysProvider = new SpaceDaysProvider(
			this.errorLogger,
			happeningService,
			calendarDayService,
			sneatApiService,
		);
	}

	override ngOnDestroy(): void {
		super.ngOnDestroy();
		this.spaceDaysProvider.destroy();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['space']) {
			this.onSpaceContextChanged();
			const spaceChange = changes['space'];
			const prevSpace = spaceChange.previousValue as ISpaceContext | undefined;
			const currentSpace = spaceChange.currentValue as
				| ISpaceContext
				| undefined;
			if (currentSpace && currentSpace?.id !== prevSpace?.id) {
				this.onSpaceIdChanged(currentSpace);
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
					space: this.$space(),
				};
				return result;
			}) || [];
		this.onRecurringsLoaded();
	}

	protected abstract onRecurringsLoaded(): void;

	private onSpaceIdChanged(space: ISpaceContext): void {
		// console.log('ScheduleComponent.onSpaceIdChanged()', this.space?.id);
		this.schedulusSpaceSubscription?.unsubscribe();
		if (!space) {
			return;
		}
		this.populateRecurrings();
		this.setDay('onSpaceIdChanged', this.date);
		this.schedulusSpaceSubscription = this.calendariumSpaceService
			.watchSpaceModuleRecord(space.id)
			.subscribe({
				next: (calendariumSpace) => {
					// console.log(
					// 	'ScheduleComponent.onSpaceIdChanged() => calendariumSpace:',
					// 	calendariumSpace,
					// );
					this.schedulusSpaceDbo = calendariumSpace?.dbo;
					this.spaceDaysProvider.setSchedulusSpace({
						space,
						...calendariumSpace,
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
		const space = this.$space();
		if (space) {
			this.spaceDaysProvider.setSpace(space);
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
