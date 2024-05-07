import { Component, Inject, Input, OnChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { ScheduleFilterService } from '../../../schedule-filter.service';
import { IScheduleFilter, isMatchingScheduleFilter } from '../schedule-filter';

@Component({
	selector: 'sneat-single-happenings-list',
	templateUrl: 'single-happenings-list.component.html',
})
export class SingleHappeningsListComponent
	extends SneatBaseComponent
	implements OnChanges
{
	@Input({ required: true }) team: ITeamContext = { id: '' };
	@Input({ required: true }) public happenings?: IHappeningContext[];

	private filter?: IScheduleFilter;

	protected happeningsMatchingFilter?: IHappeningContext[];

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		readonly filterService: ScheduleFilterService,
	) {
		super('SingleHappeningsListComponent', errorLogger);
		filterService.filter.pipe(takeUntil(this.destroyed)).subscribe((filter) => {
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

	protected clearFilter(): void {
		this.filterService.resetScheduleFilter();
	}

	public ngOnChanges(/*changes: SimpleChanges*/): void {
		this.applyFilter();
	}
}
