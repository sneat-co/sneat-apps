import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonLabel,
	IonSegment,
	IonSegmentButton,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { DatatugNavContextService } from '@sneat/ext-datatug-services-nav';
import { IProjEnv } from '@sneat/ext-datatug-models';

export interface IEnv {
	readonly id: string;
	readonly title?: string;
}

@Component({
	selector: 'sneat-datatug-env-selector',
	templateUrl: './env-selector.component.html',
	imports: [IonSegment, FormsModule, IonSegmentButton, IonLabel],
})
export class EnvSelectorComponent {
	private readonly dataTugNavContext = inject(DatatugNavContextService);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	public currentEnvId?: string;

	public environments?: IProjEnv[];

	constructor() {
		const dataTugNavContext = this.dataTugNavContext;

		dataTugNavContext.currentProject.subscribe((currentProject) => {
			if (currentProject?.summary?.environments) {
				this.environments = currentProject.summary.environments;
			}
		});
		dataTugNavContext.currentEnv.subscribe({
			next: (currentEnv) => {
				console.log('EnvSelectorComponent: currentEnv =>', currentEnv);
				this.currentEnvId = currentEnv?.id;
			},
			error: (err: unknown) =>
				this.errorLogger.logError(
					err,
					'Failed to get current environment by EnvSelectorComponent',
				),
		});
	}

	public envChanged(event: Event): void {
		console.log('envChanged', event);
		this.dataTugNavContext.setCurrentEnvironment(this.currentEnvId);
	}
}
