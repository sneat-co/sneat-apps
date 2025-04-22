import { Directive, OnDestroy, Injector, inject, signal } from '@angular/core';
import { dateToIso } from '@sneat/core';
import { WithSpaceInput } from '@sneat/space-components';
import { CalendarDayService } from '../../services/calendar-day.service';
import { CalendariumSpaceService } from '../../services/calendarium-space.service';
import { HappeningService } from '../../services/happening.service';
import {
	CalendarHappeningBriefsByID,
	ICalendariumSpaceDbo,
	IHappeningWithUiState,
} from '@sneat/mod-schedulus-core';
import { zipMapBriefsWithIDs } from '@sneat/space-models';
import { CalendarDataProvider } from '../../services/calendar-data-provider';

@Directive()
export abstract class CalendarBaseComponent
	extends WithSpaceInput
	implements OnDestroy
{
	protected date = new Date();

	protected readonly spaceDaysProvider: CalendarDataProvider;

	private readonly $calendariumSpaceDbo = signal<
		ICalendariumSpaceDbo | null | undefined
	>(undefined);

	protected readonly $allRecurrings = signal<
		readonly IHappeningWithUiState[] | undefined
	>(undefined);

	protected readonly injector = inject(Injector);

	protected constructor(
		className: string,
		calendariumSpaceService: CalendariumSpaceService,
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

	protected populateRecurrings(
		recurringBriefs?: CalendarHappeningBriefsByID,
	): void {
		console.log('populateRecurrings', recurringBriefs);
		this.$allRecurrings.update(
			(prevAll) =>
				zipMapBriefsWithIDs(recurringBriefs || {})?.map((rh) => {
					const { id } = rh;
					const prev = prevAll?.find((p) => p.id === id);
					const result: IHappeningWithUiState = {
						id,
						brief: rh.brief,
						state: prev?.state || {},
						space: this.$space(),
					};
					return result;
				}) || [],
		);
		this.onRecurringsLoaded();
	}

	protected abstract onRecurringsLoaded(): void;

	protected override onSpaceIdChanged(spaceID: string): void {
		super.onSpaceIdChanged(spaceID);
		// console.log('ScheduleComponent.onSpaceIdChanged()', this.space?.id);
		if (!spaceID) {
			return;
		}
		this.setDay('onSpaceIdChanged', this.date);
		this.populateRecurrings(
			this.spaceDaysProvider.$recurringsBySpaceID()[spaceID],
		);
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
