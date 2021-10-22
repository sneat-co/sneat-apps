import { Inject, Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NewProjectFormComponent } from './new-project-form.component';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Injectable()
export class NewProjectService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController
	) {}

	public openNewProjectDialog(event: Event): void {
		console.log('openNewProjectDialog', event);
		this.popoverController
			.create({
				component: NewProjectFormComponent,
				cssClass: 'small-popover',
				componentProps: {
					onCancel: () =>
						this.popoverController
							.dismiss()
							.catch(
								this.errorLogger.logErrorHandler(
									'failed to dismiss popover on cancel'
								)
							),
				},
			})
			.then((popover) => {
				popover
					.present()
					.catch(this.errorLogger.logErrorHandler('Failed to present modal'));
			})
			.catch(this.errorLogger.logErrorHandler('Failed to create modal:'));
	}
}
