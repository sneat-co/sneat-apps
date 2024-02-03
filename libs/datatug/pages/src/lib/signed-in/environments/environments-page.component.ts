import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatCardListComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { DatatugNavContextService } from '@sneat/datatug-services-nav';
import { IProjectSummary } from '@sneat/datatug-models';

@Component({
	selector: 'sneat-datatug-environments',
	templateUrl: './environments-page.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule, SneatCardListComponent],
})
export class EnvironmentsPageComponent {
	protected project?: IProjectSummary;

	public environments?: { id: string; title?: string }[];

	constructor(
		readonly datatugNavContextService: DatatugNavContextService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		this.setProjSummary(history.state.projSummary as IProjectSummary);
		if (!this.project) {
			// this.projectService.getSummary()
		}
		datatugNavContextService.currentProject.subscribe({
			next: (value) => {
				if (value) {
					this.project = value.summary;
				}
			},
			error: (err) =>
				this.errorLogger.logError(err, 'failed to retrieve current page', {
					show: false,
				}),
		});
		console.log('EnvironmentsPage.constructor()', this.project);
	}

	private setProjSummary(p: IProjectSummary): void {
		console.log('EnvironmentsPage.setProjSummary()', p);
		if (!this.environments) {
			this.environments = this.project?.environments;
		}
	}
}
