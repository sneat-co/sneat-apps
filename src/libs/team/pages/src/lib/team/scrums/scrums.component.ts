import { Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ITeamDto } from '@sneat/dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { getMeetingIdFromDate, getToday } from '@sneat/meeting';
import { IRecord } from '@sneat/data';
import { ScrumService } from '@sneat/scrumspace/dailyscrum';
import { IScrum } from '@sneat/scrumspace/scrummodels';
import { TeamNavService } from '@sneat/team/services';

@Component({
	selector: 'sneat-team-scrums',
	templateUrl: './scrums.component.html',
})
export class ScrumsComponent implements OnChanges, OnDestroy {
	@Input() public team?: IRecord<ITeamDto>;

	public prevScrumId?: string;
	public todayScrum?: IScrum;

	protected readonly destroyed = new Subject<boolean>();

	private teamId?: string;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly scrumService: ScrumService,
		private readonly navController: NavController,
		public readonly navService: TeamNavService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			try {
				if (this.team && this.teamId !== this.team.id) {
					this.todayScrum = undefined;
					this.prevScrumId = undefined;
				}
				const team = this.team?.dto;
				if (team?.last?.scrum?.id) {
					const today = getToday();
					const todayId = getMeetingIdFromDate(today);
					if (team.last?.scrum?.id === todayId && this.team?.id) {
						this.scrumService
							.watchScrum(this.team.id, todayId)
							.pipe(takeUntil(this.destroyed))
							.subscribe({
								next: (scrum) => {
									this.todayScrum = scrum;
									this.prevScrumId =
										scrum && scrum.scrumIds && scrum.scrumIds.prev;
								},
								error: (err) =>
									this.errorLogger.logError(
										err,
										`failed to load scrum by id=${todayId}`,
										{ feedback: false, show: false, report: true },
									),
							});
					} else {
						this.prevScrumId = team.last.scrum.id;
					}
				}
			} catch (e) {
				this.errorLogger.logError(e, 'Failed to process team changes');
			}
		}
	}

	public goScrum(
		date?: 'today' | string,
		tab?: 'team' | 'my',
		event?: Event,
	): void {
		try {
			console.log(`TeamPage.goScrum(${date}, tab=${tab})`);
			if (!date) {
				this.errorLogger.logError('date is empty or undefined', date);
				return;
			}
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			const scrum = date === 'today' &&
				this.todayScrum && {
					id: getMeetingIdFromDate(getToday()),
					data: this.todayScrum,
				};
			if (this.team && scrum) {
				this.navService.navigateToScrum(date, this.team, scrum, tab);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to navigate to scrum');
		}
	}

	public goScrums(event?: Event): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (this.team) {
			this.navService.navigateToScrums(this.navController, this.team);
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next(true);
		this.destroyed.complete();
	}
}
