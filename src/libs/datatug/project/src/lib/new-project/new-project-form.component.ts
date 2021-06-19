import {Component, Inject, Input} from "@angular/core";
import {PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {ProjectService} from "@sneat/datatug/services/project";
import {IProjStoreRef} from "@sneat/datatug/models";
import {DatatugNavService} from "@sneat/datatug/services/nav";

@Component({
	selector: 'datatug-new-project-form',
	templateUrl: 'new-project-form.component.html'
})
export class NewProjectFormComponent {
	store = 'cloud';
	title = '';

	@Input() onCancel?: () => void;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly projectService: ProjectService,
		private readonly popoverController: PopoverController,
		private readonly nav: DatatugNavService,
	) {
	}

	cancel(): void {
		if (this.onCancel) {
			this.onCancel();
		}
	}

	create(): void {
		console.log('NewProjectFormComponent.create()');
		const projStoreRef: IProjStoreRef = {
			type: 'firestore',
		};
		this.projectService.createNewProject(projStoreRef, {title: this.title, userIds: []}).subscribe({
			next: projectId => {
				const m = 'New project ID: ' + projectId;
				console.log(m);
				this.popoverController.dismiss().catch(this.errorLogger.logErrorHandler('failed to close popover with new project form'));
				this.nav.goProject({storeId: projStoreRef.type, projectId});
			},
			error: this.errorLogger.logErrorHandler('Failed to create a new project'),
		});
	}
}
