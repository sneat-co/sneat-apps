import { CommonModule } from '@angular/common';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonicModule,
	IonInput,
	PopoverController,
	ViewDidEnter,
} from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	DatatugServicesProjectModule,
	ProjectService,
} from '@sneat/datatug-services-project';
import { DatatugNavService } from '@sneat/datatug-services-nav';
import { IProjectContext } from '@sneat/datatug-nav';
import { parseStoreRef } from '@sneat/core';

@Component({
	selector: 'sneat-datatug-new-project-form',
	templateUrl: 'new-project-form.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		DatatugServicesProjectModule,
	],
})
export class NewProjectFormComponent implements ViewDidEnter {
	store = 'cloud';
	title = '';

	isCreating = false;

	@Input() onCancel?: () => void;

	@ViewChild(IonInput, { static: false }) titleInput?: IonInput;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly projectService: ProjectService,
		private readonly popoverController: PopoverController,
		private readonly nav: DatatugNavService,
	) {}

	ionViewDidEnter(): void {
		setTimeout(() => {
			this.titleInput?.setFocus().catch(console.error);
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
		const storeId = 'firestore';
		this.projectService
			.createNewProject(storeId, { title: this.title, userIDs: [] })
			.subscribe({
				next: (projectId) => {
					const m = 'New project ID: ' + projectId;
					console.log(m);
					this.popoverController
						.dismiss()
						.catch(
							this.errorLogger.logErrorHandler(
								'failed to close popover with new project form',
							),
						);
					const projectContext: IProjectContext = {
						ref: { projectId, storeId },
						store: { ref: parseStoreRef(storeId) },
					};
					this.nav.goProject(projectContext);
				},
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to create a new project');
					this.isCreating = false;
				},
			});
	}
}
