import { Injectable, inject } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { NewProjectFormComponent } from './new-project-form.component';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

@Injectable()
export class NewProjectService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly popoverController = inject(PopoverController);

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
                  'failed to dismiss popover on cancel',
                ),
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
