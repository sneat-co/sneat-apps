import { Directive, OnDestroy, Injector, inject } from '@angular/core';
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
import { CalendarDataProvider } from '../../services/calendar-data-provider';

@Directive()
export abstract class CalendarBaseComponent
	extends WithSpaceInput
	implements OnDestroy
{
	protected date = new Date();

	protected readonly spaceDaysProvider: CalendarDataProvider;

	private schedulusSpaceDbo?: ICalendariumSpaceDbo | null;

	protected allRecurrings?: readonly IHappeningWithUiState[];

	protected readonly injector = inject(Injector);

	protected constructor(
		className: string,
		private readonly calendariumSpaceService: CalendariumSpaceService,
		happeningService: HappeningService,
		calendarDayService: CalendarDayService,
	) {
		super(className);
		console.log(`${className}:CalendarBaseComponent.constructor()`);
		this.spaceDaysProvider = new CalendarDataProvider(
			this.injector,
			this.$spaceID,
			this.errorLogger,
			happeningService,
			calendarDayService,
			calendariumSpaceService,
		);
	}

	override ngOnDestroy(): void {
		super.ngOnDestroy();
		this.spaceDaysProvider.destroy();
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
		if (!space) {
			return;
		}
		this.populateRecurrings();
		this.setDay('onSpaceIdChanged', this.date);
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
