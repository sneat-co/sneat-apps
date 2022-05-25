import { Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext, ITeamContext } from '@sneat/team/models';
import { Subject, Subscription } from 'rxjs';
import { HappeningService } from '../../services/happening.service';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-singles-tab',
	templateUrl: 'singles-tab.component.html',
})
export class SinglesTabComponent implements OnChanges, OnDestroy {

	private readonly destroyed = new Subject<void>();
	private singlesSubscription?: Subscription;
	public upcomingSingles?: IHappeningContext[];

	public tab: 'upcoming' | 'past' = 'upcoming';

	@Input() team?: ITeamContext;
	@Input() onSlotClicked?: (slot: ISlotItem) => void;
	@Input() onDateSelected?: (date: Date) => void;

	readonly trackByDate = (i: number, item: Weekday): number | undefined => item.day?.date.getTime();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		const teamChange = changes['team'];
		if (teamChange) {
			if (this.team?.id !== teamChange.previousValue?.id) {
				this.watchUpcomingSingles();
			}
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
		this.singlesSubscription?.unsubscribe();
	}


	watchUpcomingSingles(): void {
		if (this.singlesSubscription) {
			this.singlesSubscription?.unsubscribe();
		}
		if (this.team) {
			this.singlesSubscription = this.happeningService.watchUpcomingSingles(this.team?.id).subscribe({
				next: singles => {
					this.upcomingSingles = singles;
					console.log('upcoming single:', singles);
				},
				error: e => {
					this.errorLogger.logError(e, 'Failed to load upcoming happenings');
				}
			})
		}
	}

	public notImplemented(): void {
		alert('Sorry, not implemented yet.');
	}

}
