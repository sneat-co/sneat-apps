import { Component, Input, inject } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { IErrorLogger } from '@sneat/core';
import { IProjectContext } from '../nav/nav-models';
import { DatatugNavContextService } from '../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../services/nav/datatug-nav.service';

@Component({
  selector: 'sneat-datatug-menu-env-selector',
  templateUrl: 'menu-env-selector.component.html',
})
export class MenuEnvSelectorComponent {
  private readonly errorLogger = inject(IErrorLogger);
  private readonly popoverController = inject(PopoverController);
  private readonly nav = inject(DatatugNavService);
  private readonly datatugNavContextService = inject(DatatugNavContextService);

  @Input() project?: IProjectContext;
  @Input() currentEnvId?: string;

  public clearEnv(): void {
    // Called from template
    try {
      this.datatugNavContextService.setCurrentEnvironment(undefined);
      if (this.project?.ref && this.project?.summary?.id) {
        this.nav.goProject(this.project);
      }
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to clear environment');
    }
  }

  switchEnv(event: CustomEvent): void {
    // console.log('switchEnv', event);
    try {
      const envId = event.detail.value as string;
      if (envId !== this.currentEnvId) {
        // console.log('switchEnv', event);
        // const env = this.currentProject.environments.find(e => e.id === value);
        this.datatugNavContextService.setCurrentEnvironment(envId);
        if (this.project?.ref) {
          this.nav.goEnvironment(this.project, undefined, envId);
        }
      }
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to handle environment switch');
    }
  }
}
