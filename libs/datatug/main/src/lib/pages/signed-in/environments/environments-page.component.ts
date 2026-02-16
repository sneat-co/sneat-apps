import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SneatCardListComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { IProjectSummary } from '../../../models/definition/project';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';

@Component({
  selector: 'sneat-datatug-environments',
  templateUrl: './environments-page.component.html',
  imports: [
    FormsModule,
    SneatCardListComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
  ],
})
export class EnvironmentsPageComponent {
  readonly datatugNavContextService = inject(DatatugNavContextService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

  protected project?: IProjectSummary;

  public environments?: { id: string; title?: string }[];

  constructor() {
    const datatugNavContextService = this.datatugNavContextService;

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
// console.log('EnvironmentsPage.constructor()', this.project);
  }

  private setProjSummary(p: IProjectSummary): void {
// console.log('EnvironmentsPage.setProjSummary()', p);
    if (!this.environments) {
      this.environments = this.project?.environments;
    }
  }
}
