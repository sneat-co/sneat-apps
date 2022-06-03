import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { IUserTeamBrief, TeamType } from '@sneat/auth-models';
import { ITeamContext, teamContextFromBrief } from '@sneat/team/models';
import { SneatUserService } from '@sneat/user';
import { Subject, takeUntil } from 'rxjs';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-for-team-card',
	templateUrl: 'for-team-type-card.component.html',
})
export class ForTeamTypeCardComponent implements OnDestroy {
	readonly destroyed = new Subject<void>();

	@Input() emptyTitle?: string;
	@Input() itemsTitle?: string;
	@Input() buttonColor?: string;
	@Input() newTeamButtonText?: string;
	@Input() singleTeamButtonText?: string;
	@Input() teamTypes?: TeamType[];

	teams?: ITeamContext[];

	constructor(
		userService: SneatUserService,
		changeDetectorRef: ChangeDetectorRef,
	) {

		userService.userState
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: user => {
					this.teams = user.record?.teams
						?.filter(t => this.teamTypes?.some(tt => tt === t.type))
						.map(teamContextFromBrief);
					console.log('ForTeamTypeCardComponent =>', this.teamTypes, user.record?.teams, this.teams)
					changeDetectorRef.markForCheck();
				},
			});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
