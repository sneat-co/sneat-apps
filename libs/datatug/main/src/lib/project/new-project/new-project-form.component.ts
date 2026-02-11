import { Component, Input, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PopoverController,
  ViewDidEnter,
  IonButton,
  IonButtons,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { parseStoreRef } from '@sneat/core';
import { IProjectContext } from '../../nav/nav-models';
import { DatatugNavService } from '../../services/nav/datatug-nav.service';
import { DatatugServicesProjectModule } from '../../services/project/datatug-services-project.module';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'sneat-datatug-new-project-form',
  templateUrl: 'new-project-form.component.html',
  imports: [
    FormsModule,
    DatatugServicesProjectModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonItemDivider,
    IonInput,
    IonFooter,
  ],
})
export class NewProjectFormComponent implements ViewDidEnter {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly projectService = inject(ProjectService);
  private readonly popoverController = inject(PopoverController);
  private readonly nav = inject(DatatugNavService);

  store = 'cloud';
  title = '';

  isCreating = false;

  @Input() onCancel?: () => void;

  @ViewChild(IonInput, { static: false }) titleInput?: IonInput;

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
