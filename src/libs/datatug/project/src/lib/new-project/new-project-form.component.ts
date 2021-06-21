import {Component, Inject, Input, ViewChild} from "@angular/core";
import {IonInput, PopoverController, ViewDidEnter} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {ProjectService} from "@sneat/datatug/services/project";
import {IProjStoreRef} from "@sneat/datatug/models";
import {DatatugNavService} from "@sneat/datatug/services/nav";

@Component({
	selector: 'datatug-new-project-form',
	templateUrl: 'new-project-form.component.html'
})
export class NewProjectFormComponent implements ViewDidEnter {
	store = 'cloud';
	title = '';

	isCreating = false;

	@Input() onCancel?: () => void;

	@ViewChild(IonInput, {static: false}) titleInput?: IonInput;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly projectService: ProjectService,
		private readonly popoverController: PopoverController,
		private readonly nav: DatatugNavService,
	) {
	}

	ionViewDidEnter(): void {
        setTimeout(() => {
        	this.titleInput?.setFocus();
		}, 100);
    }

	cancel(): void {
		if (this.onCancel) {
			this.onCancel();
		}
	}

	create(): void {
		console.log('NewProjectFormComponent.create()');
		this.isCreating = true;
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
			error: err => {
				this.errorLogger.logError(err,'Failed to create a new project');
				this.isCreating = false;
			},
		});
	}
}
