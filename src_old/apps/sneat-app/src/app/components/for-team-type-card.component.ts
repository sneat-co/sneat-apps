import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { IUserTeamBrief, TeamType } from '@sneat/auth-models';
import { ITeamContext, teamContextFromBrief } from '@sneat/team/models';
import { SneatUserService } from '@sneat/auth';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-for-team-card',
	templateUrl: 'for-team-type-card.component.html',
})
export class ForTeamTypeCardComponent implements OnChanges, OnDestroy {
	readonly destroyed = new Subject<void>();

	@Input() emptyTitle?: string;
	@Input() itemsTitle?: string;
	@Input() buttonColor?: string;
	@Input() newTeamButtonText?: string;
	@Input() singleTeamButtonText?: string;
	@Input() teamTypes?: TeamType[];

	teams?: ITeamContext[];

	private subscription?: Subscription;

	constructor(
		private readonly userService: SneatUserService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['teamTypes']) {
			if (this.subscription) {
				this.subscription.unsubscribe();
			}
			this.watchUserRecord();
		}
	}

	private watchUserRecord(): void {
		this.subscription = this.userService.userState
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: user => {
					this.teams = user.record?.teams
						?.filter(t => this.teamTypes?.some(tt => tt === t.type))
						.map(teamContextFromBrief);
					console.log('ForTeamTypeCardComponent =>', this.teamTypes, user.record?.teams, this.teams);
					this.changeDetectorRef.markForCheck();
				},
			});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

}
