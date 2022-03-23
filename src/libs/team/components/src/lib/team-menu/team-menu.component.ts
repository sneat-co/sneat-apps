import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { TeamPageContextComponent } from '../team-page-context';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-team-menu',
	templateUrl: './team-menu.component.html',
	styleUrls: ['./team-menu.component.scss'],
})
export class TeamMenuComponent implements OnInit {

	@ViewChild(TeamPageContextComponent) context?: TeamPageContextComponent;

	public team?: ITeamContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	ngOnInit(): void {
		this.context?.team.subscribe({
			next: team => {
				this.team = team || undefined;
			},
			error: this.errorLogger.logErrorHandler,
		});
	}

}
