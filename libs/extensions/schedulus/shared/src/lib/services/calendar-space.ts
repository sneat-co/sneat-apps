import { signal } from '@angular/core';
import { INavContext } from '@sneat/core';
import { hasRelated } from '@sneat/dto';
import { ModuleSpaceItemService } from '@sneat/space-services';
import { CalendariumSpaceService } from '../services/calendarium-space.service';
import {
	ICalendariumSpaceDbo,
	IHappeningBrief,
	IHappeningDbo,
	ICalendariumSpaceContext,
	ISlotUIContext,
	RecurringSlots,
} from '@sneat/mod-schedulus-core';
import {
	ISpaceItemNavContext,
	ISpaceItemWithOptionalDbo,
	zipMapBriefsWithIDs,
} from '@sneat/space-models';
import {
	BehaviorSubject,
	filter,
	map,
	Observable,
	shareReplay,
	skip,
	Subject,
	takeUntil,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { CalendarDay } from './calendar-day';
import {
	emptyRecurringsByWeekday,
	groupRecurringSlotsByWeekday,
	ISpaceRecurrings,
	RecurringsByWeekday,
} from './calendar-types';

export class CalendarSpace {
	private readonly destroyed = new Subject<void>();

	public destroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	public readonly $recurrings = signal<ISpaceRecurrings | undefined>(undefined);

	public readonly $recurringByWd = signal<Readonly<RecurringsByWeekday>>(
		emptyRecurringsByWeekday(),
	);

	private readonly calendariumSpace$ = new BehaviorSubject<
		ICalendariumSpaceContext | undefined
	>(undefined);

	public readonly recurrings$: Observable<RecurringSlots> =
		this.calendariumSpace$.pipe(
			skip(1), // We are not interested in processing the first 'undefined' value of BehaviorSubject
			filter((schedulusSpace) => !!schedulusSpace), // Not sure if we need this.
			// TODO: Instead of providing all slots we can provide observables of slots for a specific day
			// That would minimize number of handlers to be called on watching components
			map((schedulusSpace) => groupRecurringSlotsByWeekday(schedulusSpace)),
			tap((slots) => console.log('SpaceDaysProvider.recurrings$ =>', slots)),
			shareReplay(1),
		);

	constructor(
		public readonly spaceID: string,
		private readonly calendariumSpaceService: CalendariumSpaceService,
		// private readonly recurringsSpaceItemService: ModuleSpaceItemService<
		// 	IHappeningBrief,
		// 	IHappeningDbo
		// >,
		private readonly contactID?: string,
	) {
		this.calendariumSpaceService.watchSpaceModuleRecord(spaceID).subscribe({
			next: (calendariumSpace) => {
				const newRH = calendariumSpace.dbo?.recurringHappenings || {};
				this.$recurrings.update((r) =>
					Object.keys(newRH).length === 0 &&
					Object.keys(r?.recurringHappenings || {}).length === 0
						? r
						: {
								spaceID,
								recurringHappenings:
									calendariumSpace.dbo?.recurringHappenings || {},
							},
				);
			},
		});
	}

	public setSchedulusSpace(
		schedulusSpace: ISpaceItemWithOptionalDbo<ICalendariumSpaceDbo>,
	): void {
		console.log('SpaceDaysProvider.setSchedulusSpace()', schedulusSpace);
		this.calendariumSpace$.next(schedulusSpace);
		this.processRecurringBriefs();
	}

	// private watchRecurringsBySpaceID(
	// 	spaceID: string,
	// ): Observable<INavContext<IHappeningBrief, IHappeningDbo>[]> {
	// 	console.log('SpaceDaysProvider.loadRegulars()');
	// 	const $recurrings = this.recurringsSpaceItemService
	// 		.watchModuleSpaceItemsWithSpaceRef({ id: spaceID })
	// 		// const $regulars = this.regularService.watchByCommuneId(this.communeId)
	// 		.pipe(
	// 			takeUntil(this.destroyed),
	// 			tap((recurrings) => {
	// 				recurrings.forEach((recurring) => this.processRecurring(recurring));
	// 			}),
	// 		);
	// 	return $recurrings;
	// }

	private processRecurringBriefs(): void {
		console.log(
			'SpaceDaysProvider.processRecurringBriefs()',
			this.calendariumSpace$.value,
		);
		if (!this.calendariumSpace$.value?.dbo?.recurringHappenings) {
			return;
		}
		const spaceID = this.spaceID;
		zipMapBriefsWithIDs(
			this.calendariumSpace$.value?.dbo?.recurringHappenings,
		).forEach((rh) => {
			this.processRecurring({
				id: rh.id,
				brief: rh.brief,
				space: { id: spaceID },
			});
		});
	}

	private processRecurring(
		recurring: ISpaceItemNavContext<IHappeningBrief, IHappeningDbo>,
	): void {
		if (
			this.contactID &&
			hasRelated(
				recurring.dbo?.related || recurring?.brief?.related,
				'contactus',
				'contacts',
				{ spaceID: this.spaceID, itemID: this.contactID },
			)
		) {
			return;
		}
		console.log('SpaceDaysProvider.processRecurring()', recurring);
		const recurringByWd = emptyRecurringsByWeekday();
		const { brief } = recurring;
		if (!brief) {
			throw new Error('recurring context has no brief');
		}
		if (!brief.title) {
			throw new Error(`!brief.title`);
		}
		if (brief.slots) {
			Object.entries(brief.slots).forEach(([slotID, slot]) => {
				slot.weekdays?.forEach((wd) => {
					if (slot.repeats === 'weekly' && !wd) {
						throw new Error(`slot.repeats === 'weekly' && !wd=${wd}`);
					}
					const slotItem: ISlotUIContext = {
						slot: { ...slot, id: slotID },
						wd: wd,
						happening: recurring,
						title: brief.title,
						repeats: slot.repeats,
						timing: { start: slot.start, end: slot.end },
						location: slot.location,
						levels: brief.levels,
						// participants: dto.participants,
					};
					const wdRecurrings = recurringByWd[wd];
					if (wdRecurrings) {
						wdRecurrings.push(slotItem);
					}
				});
			});
		}
		this.$recurringByWd.set(recurringByWd);
	}

	private addRecurringsToSlotsGroup(weekday: CalendarDay): void {
		const recurrings = this.$recurringByWd()[weekday.wd];
		if (!recurrings) {
			return;
		}
		const wdRecurrings =
			weekday.slots &&
			weekday.slots.filter((r) => r.happening.brief?.type === 'recurring');
		if (wdRecurrings && wdRecurrings.length === recurrings.length) {
			return;
		}
		if (recurrings.length) {
			// weekday.slots = weekday.slots ? [
			// 	...recurrings,
			// 	...weekday.slots.filter(r => r.type !== 'recurring'),
			// ] : [...recurrings];
		} else {
			// weekday.slots = weekday.slots ? weekday.slots.filter(r => !r.recurring) : [];
		}
	}
}
