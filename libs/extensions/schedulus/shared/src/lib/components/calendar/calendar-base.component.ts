import {
	Directive,
	effect,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
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
import { CalendarDaysProvider } from '../../services/calendar-days-provider';

@Directive()
export abstract class CalendarBaseComponent
	extends WithSpaceInput
	implements OnChanges, OnDestroy
{
	protected date = new Date();

	protected readonly spaceDaysProvider: CalendarDaysProvider;

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
		this.spaceDaysProvider = new CalendarDaysProvider(
			this.errorLogger,
			happeningService,
			calendarDayService,
			sneatApiService,
		);
		effect(() => {
			const spaceID = this.$spaceID();
			this.spaceDaysProvider.addSpaceID(spaceID);
		});
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
		if (space.id) {
			this.spaceDaysProvider.addSpaceID(space.id);
		}
		this.schedulusSpaceSubscription = this.calendariumSpaceService
			.watchSpaceModuleRecord(space.id)
			.subscribe({
				next: (calendariumSpace) => {
					// console.log(
					// 	'ScheduleComponent.onSpaceIdChanged() => calendariumSpace:',
					// 	calendariumSpace,
					// );
					this.schedulusSpaceDbo = calendariumSpace?.dbo;
					// this.spaceDaysProvider.addSpaceID({
					// 	space,
					// 	// ...calendariumSpace,
					// });
					this.populateRecurrings(); // TODO subscribe to recurrings from spaceDaysProvider
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
		if (space.id) {
			this.spaceDaysProvider.addSpaceID(space.id);
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
