import {Component, Inject} from '@angular/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {DatatugNavContextService} from '@sneat/datatug/services/nav';
import {IDatatugProjectSummary} from '@sneat/datatug/models';

@Component({
	selector: 'datatug-environments',
	templateUrl: './environments.page.html',
})
export class EnvironmentsPage {

	public project: IDatatugProjectSummary;

	public environments: { id: string; title?: string }[];

	constructor(
		readonly datatugNavContextService: DatatugNavContextService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		this.setProjSummary(history.state.projSummary as IDatatugProjectSummary);
		if (!this.project) {
			// this.projectService.getSummary()
		}
		datatugNavContextService.currentProject.subscribe({
			next: value => {
				if (value) {
					this.project = value.summary;
				}
			},
			error: err => this.errorLogger.logError(err, 'failed to retrieve current page', {show: false}),
		})
		console.log('EnvironmentsPage.constructor()', this.project)
	}

	private setProjSummary(p: IDatatugProjectSummary): void {
		if (!this.environments) {
			this.environments = this.project?.environments;
		}
	}

}
