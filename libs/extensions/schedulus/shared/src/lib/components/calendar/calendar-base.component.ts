import {
	Directive,
	OnDestroy,
	Injector,
	inject,
	signal,
	computed,
} from '@angular/core';
import { dateToIso } from '@sneat/core';
import { UiState } from '@sneat/dto';
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

const emptyUiState: UiState = {};

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

	protected readonly $recurringStates = signal<
		Readonly<Record<string, UiState>>
	>({});

	protected readonly $allRecurrings = computed<
		readonly IHappeningWithUiState[] | undefined
	>(() => {
		const recurringsBySpaceID = this.spaceDaysProvider.$recurringsBySpaceID();
		if (Object.keys(recurringsBySpaceID).length === 0) {
			return undefined;
		}
		const allRecurrings: IHappeningWithUiState[] = [];
		// We are not updating $recurringStates here so there us no circular dependency
		const recurringStates = this.$recurringStates();
		Object.entries(recurringsBySpaceID).forEach(
			([spaceId, recurringBriefs]) => {
				const spaceRecurrings =
					zipMapBriefsWithIDs(recurringBriefs || {})?.map((rh) => {
						const { id } = rh;
						const prevState = recurringStates[id + '@' + spaceId];
						const result: IHappeningWithUiState = {
							id,
							brief: rh.brief,
							state: prevState || emptyUiState,
							space: { id: spaceId },
						};
						return result;
					}) || [];
				allRecurrings.push(...spaceRecurrings);
			},
		);
		return allRecurrings;
	});

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

	protected override onSpaceIdChanged(spaceID: string): void {
		super.onSpaceIdChanged(spaceID);
		// console.log('ScheduleComponent.onSpaceIdChanged()', this.space?.id);
		if (!spaceID) {
			return;
		}
		// this.setDay('onSpaceIdChanged', this.date);
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
