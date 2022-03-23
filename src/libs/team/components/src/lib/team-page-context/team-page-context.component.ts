import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ErrorLogger, IErrorLogger } from "@sneat/logging";
import { NavController } from "@ionic/angular";
import {
	TeamNavService,
	TeamService,
	trackTeamIdFromRouteParameter
} from "@sneat/team/services";
import { SneatUserService } from "@sneat/user";
import { AnalyticsService, IAnalyticsService } from "@sneat/analytics";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { ITeamContext } from "@sneat/team/models";

@Component({
	selector: "sneat-team-page-context",
	template: "",
})
export class TeamPageContextComponent implements OnInit, OnDestroy {

	@Input() page?: string;

	public readonly destroyed = new Subject<boolean>();
	public readonly logError = this.errorLogger.logError;

	private teamContext = new BehaviorSubject<ITeamContext | undefined | null>(undefined);

	public readonly team = this.teamContext.asObservable();

	constructor(
		@Inject(ErrorLogger)
		public readonly errorLogger: IErrorLogger,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		public readonly route: ActivatedRoute,
		public readonly navController: NavController,
		public readonly teamService: TeamService,
		public readonly userService: SneatUserService,
		public readonly navService: TeamNavService
	) {
		console.log("TeamPageContextComponent.constructor()", route.url);
		trackTeamIdFromRouteParameter(route).pipe(
			takeUntil(this.destroyed)
		).subscribe({
			next: this.onTeamIdChanged,
			error: this.errorLogger.logErrorHandler
		});
	}

	private onTeamIdChanged = (id: string | null): void => {
		if (this.teamContext.value?.id != id) {
			this.teamContext.next(id ? { id: id } : null);
		}
	};

	ngOnInit(): void {
		console.log("TeamPageContextComponent.ngOnInit()", this.page);
	}

	ngOnDestroy(): void {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

}
