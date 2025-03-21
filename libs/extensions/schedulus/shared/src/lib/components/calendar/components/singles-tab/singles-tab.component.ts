import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ISlotUIEvent } from '@sneat/mod-schedulus-core';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/team-models';
import { HappeningService } from '../../../../services/happening.service';
import { SneatBaseComponent } from '@sneat/ui';
import { Observable, Subscription, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-singles-tab',
	templateUrl: 'singles-tab.component.html',
	standalone: false,
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

	@Input({ required: true }) space?: ISpaceContext;

	@Output() readonly slotClicked = new EventEmitter<ISlotUIEvent>();

	@Input() onDateSelected?: (date: Date) => void;

	constructor(
		private readonly happeningService: HappeningService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super('SinglesTabComponent');
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('SinglesTabComponent.ngOnChanges()', changes);
		const spaceChange = changes['space'];
		if (spaceChange) {
			if (this.space?.id !== spaceChange.previousValue?.id) {
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
		if (!this.space) return;
		this.upcomingSinglesSubscription = this.watchSingles(
			this.happeningService.watchUpcomingSingles(this.space),
			this.upcomingSinglesSubscription,
			(singles) => (this.upcomingSingles = singles),
		);
	}

	private watchPastSingles(): void {
		if (!this.space) return;
		this.pastSinglesSubscription = this.watchSingles(
			this.happeningService.watchPastSingles(this.space),
			this.pastSinglesSubscription,
			(singles) => (this.pastSingles = singles),
		);
	}

	private watchRecentSingles(): void {
		if (!this.space) return;
		this.recentSinglesSubscription = this.watchSingles(
			this.happeningService.watchRecentlyCreatedSingles(this.space),
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
		if (!this.space) {
			return undefined;
		}

		return singles$.pipe(takeUntil(this.destroyed$)).subscribe({
			next: (singles) => {
				processSingles(singles);
				this.changeDetectorRef.detectChanges();
			},
			error: this.errorLogger.logErrorHandler('Failed to load past happenings'),
		});
	}
}
