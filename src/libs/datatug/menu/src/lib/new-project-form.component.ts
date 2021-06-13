import {Component, Inject, Input} from "@angular/core";
import {PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {ProjectService} from "@sneat/datatug/services/project";

@Component({
	selector: 'datatug-new-project-form',
	templateUrl: 'new-project-form.component.html'
})
export class NewProjectFormComponent {
	store = 'cloud';
	title = '';

	@Input() onCancel?: () => void;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly projectService: ProjectService,
	) {
	}

	cancel(): void {
		if (this.onCancel) {
			this.onCancel();
		}
	}

	create(): void {
		console.log('NewProjectFormComponent.create()')
		this.projectService.createNewProject({title: this.title, userIds: []}).subscribe({
			next: projId => {
				const m = 'New project ID: ' + projId;
				console.log(m);
				alert(m);
			},
			error: this.errorLogger.logErrorHandler('Failed to create a new project'),
		});
	}
}
