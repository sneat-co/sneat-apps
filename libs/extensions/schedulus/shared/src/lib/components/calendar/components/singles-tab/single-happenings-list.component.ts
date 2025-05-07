import { Component, Input, OnChanges } from '@angular/core';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonLabel,
	IonSpinner,
	IonText,
} from '@ionic/angular/standalone';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { CalendarFilterService } from '../../../calendar-filter.service';
import { HappeningCardComponent } from '../../../happening-card/happening-card.component';
import {
	ICalendarFilter,
	isMatchingScheduleFilter,
} from '../calendar-filter/calendar-filter';

@Component({
	selector: 'sneat-single-happenings-list',
	templateUrl: 'single-happenings-list.component.html',
	imports: [
		HappeningCardComponent,
		IonCard,
		IonCardContent,
		IonSpinner,
		IonText,
		IonButton,
		IonLabel,
	],
})
export class SingleHappeningsListComponent
	extends SneatBaseComponent
	implements OnChanges
{
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) public happenings?: IHappeningContext[];

	private filter?: ICalendarFilter;

	protected happeningsMatchingFilter?: IHappeningContext[];

	constructor(readonly filterService: CalendarFilterService) {
		super('SingleHappeningsListComponent');
		filterService.filter
			.pipe(takeUntil(this.destroyed$))
			.subscribe((filter) => {
				this.filter = filter;
				this.applyFilter();
			});
	}

	protected readonly happeningID = (_: number, h: IHappeningContext) => h.id;

	protected get numberOfHidden(): number {
		return (
			(this.happenings?.length || 0) -
			(this.happeningsMatchingFilter?.length || 0)
		);
	}

	protected onHappeningRemoved(id: string): void {
		this.happenings = this.happenings?.filter((h) => h.id !== id);
		this.applyFilter();
	}

	private applyFilter(): void {
		console.log('applyFilter()', this.filter, this.happenings);
		const f = this.filter;
		this.happeningsMatchingFilter = this.happenings?.filter((h) =>
			isMatchingScheduleFilter(h, f),
		);
	}

	protected clearFilter(event: Event): void {
		this.filterService.resetScheduleFilter(event);
	}

	public ngOnChanges(/*changes: SimpleChanges*/): void {
		this.applyFilter();
	}
}
