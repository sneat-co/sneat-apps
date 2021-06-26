import {Component, Inject, Input} from "@angular/core";
import {PopoverController} from "@ionic/angular";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugNavContextService, DatatugNavService, IProjectNavContext} from "@sneat/datatug/services/nav";
import {IDatatugProjectSummary} from "@sneat/datatug/models";
import {IDatatugProjRef} from '@sneat/datatug/core';

@Component({
	selector: 'datatug-menu-env-selector',
	templateUrl: 'menu-env-selector.component.html'
})
export class MenuEnvSelectorComponent {
	@Input() projectRef?: IDatatugProjRef;
	@Input() projectSummary?: IDatatugProjectSummary;
	@Input() currentEnvId?: string;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly nav: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
	) {
	}

	public clearEnv(): void { // Called from template
		try {
			this.datatugNavContextService.setCurrentEnvironment(undefined);
			if (this.projectRef && this.projectSummary?.id) {
				const projNavContext: IProjectNavContext = {
					id: this.projectSummary.id,
					store: {id: this.projectRef.storeId},
					brief: this.projectSummary,
				}
				this.nav.goProject(projNavContext);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to clear environment');
		}
	}

	switchEnv(event: CustomEvent): void {
		console.log('switchEnv', event);
		try {
			const envId = event.detail.value as string;
			if (envId !== this.currentEnvId) {
				console.log('switchEnv', event);
				// const env = this.currentProject.environments.find(e => e.id === value);
				this.datatugNavContextService.setCurrentEnvironment(envId);
				if (this.projectRef) {
					this.nav.goEnvironment(this.projectRef, undefined, envId);
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle environment switch');
		}
	}
}
