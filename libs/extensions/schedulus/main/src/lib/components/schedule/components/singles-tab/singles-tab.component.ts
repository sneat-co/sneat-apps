import {
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import { HappeningService } from '@sneat/team-services';
import { SneatBaseComponent } from '@sneat/ui';
import { Observable, Subscription, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-singles-tab',
	templateUrl: 'singles-tab.component.html',
})
export class SinglesTabComponent
	extends SneatBaseComponent
	implements OnChanges, OnDestroy
{
	private upcomingSinglesSubscription?: Subscription;
	protected upcomingSingles?: IHappeningContext[];

	private pastSinglesSubscription?: Subscription;
	protected pastSingles?: IHappeningContext[];

	private recentSinglesSubscription?: Subscription;
	protected recentSingles?: IHappeningContext[];

	public tab: 'upcoming' | 'past' | 'recent' = 'upcoming';

	@Input() team: ITeamContext = { id: '' };
	@Input() onSlotClicked?: (args: { slot: ISlotItem; event: Event }) => void;
	@Input() onDateSelected?: (date: Date) => void;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super('SinglesTabComponent', errorLogger);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('SinglesTabComponent.ngOnChanges()', changes);
		const teamChange = changes['team'];
		if (teamChange) {
			if (this.team?.id !== teamChange.previousValue?.id) {
				switch (this.tab) {
					case 'upcoming':
						this.watchUpcomingSingles();
						break;
					case 'past':
						this.watchPastSingles();
						break;
				}
			}
		}
	}

	protected onTabChanged(event: Event): void {
		event.stopPropagation();
		switch (this.tab) {
			case 'upcoming':
				if (!this.upcomingSinglesSubscription) {
					this.watchUpcomingSingles();
				}
				break;
			case 'past':
				if (!this.pastSinglesSubscription) {
					this.watchPastSingles();
				}
				break;
			case 'recent':
				if (!this.recentSinglesSubscription) {
					this.watchRecentSingles();
				}
				break;
		}
	}

	private watchUpcomingSingles(): void {
		this.upcomingSinglesSubscription = this.watchSingles(
			this.happeningService.watchUpcomingSingles(this.team),
			this.upcomingSinglesSubscription,
			(singles) => (this.upcomingSingles = singles),
		);
	}

	private watchPastSingles(): void {
		this.pastSinglesSubscription = this.watchSingles(
			this.happeningService.watchPastSingles(this.team),
			this.pastSinglesSubscription,
			(singles) => (this.pastSingles = singles),
		);
	}

	private watchRecentSingles(): void {
		this.recentSinglesSubscription = this.watchSingles(
			this.happeningService.watchRecentlyCreatedSingles(this.team),
			this.recentSinglesSubscription,
			(singles) => (this.recentSingles = singles),
		);
	}

	private watchSingles(
		singles$: Observable<IHappeningContext[]>,
		sub: Subscription | undefined,
		processSingles: (singles: IHappeningContext[]) => void,
	): Subscription | undefined {
		sub?.unsubscribe();
		if (!this.team) {
			return undefined;
		}

		return singles$.pipe(takeUntil(this.destroyed)).subscribe({
			next: (singles) => {
				processSingles(singles);
				this.changeDetectorRef.detectChanges();
			},
			error: this.errorLogger.logErrorHandler('Failed to load past happenings'),
		});
	}
}
