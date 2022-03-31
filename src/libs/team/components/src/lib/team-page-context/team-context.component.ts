import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITeamContext } from '@sneat/team/models';
import { trackTeamIdAndTypeFromRouteParameter } from '@sneat/team/services';
import { BehaviorSubject, distinctUntilChanged, Subject, Subscription, takeUntil } from 'rxjs';
import { TeamComponentBaseParams } from '../team-base.page';

@Component({
	selector: 'sneat-team-context',
	template: '',
	providers: [
		TeamComponentBaseParams,
	],
})
export class TeamContextComponent implements OnInit, OnDestroy {

	@Input() page?: string;

	public readonly destroyed = new Subject<boolean>();
	// public readonly logError = this.params.errorLogger.logError;

	private teamContext = new BehaviorSubject<ITeamContext | undefined | null>(undefined);

	public readonly team = this.teamContext.asObservable();
	private teamRecordSubscription?: Subscription;

	constructor(
		public readonly params: TeamComponentBaseParams,
		public readonly route: ActivatedRoute,
	) {
		console.log('TeamPageContextComponent.constructor()', route.snapshot.url, route.snapshot.params);
		trackTeamIdAndTypeFromRouteParameter(route).pipe(
			takeUntil(this.destroyed),
			distinctUntilChanged((previous, current) => previous?.id === current?.id),
		).subscribe({
			next: this.onTeamUrlChanged,
			error: this.params.errorLogger.logErrorHandler,
		});
	}

	ngOnInit(): void {
		console.log('TeamPageContextComponent.ngOnInit()', this.page);
	}

	ngOnDestroy(): void {
		this.destroyed.next(true);
		this.destroyed.complete();
	}


	private onTeamUrlChanged = (teamContext?: ITeamContext): void => {
		console.log('TeamPageContextComponent.onTeamContextChanged()', teamContext);
		if (this.teamRecordSubscription) {
			this.teamRecordSubscription.unsubscribe();
		}
		this.teamContext.next(teamContext);
		if (teamContext?.id)
			this.teamRecordSubscription = this.params.teamService.watchTeam(teamContext?.id)
				.subscribe({
					next: dto => {
						console.log('TeamPageContextComponent => team record:', this.teamContext.value?.id, teamContext.id, dto);
						if (this.teamContext.value?.id === teamContext.id) {
							this.teamContext.next({ ...this.teamContext.value, dto: dto });
						}
					},
				});
	};

}
