import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import {
	IDatatugProjectBriefWithIdAndStoreRef,
	IEnvDbServer,
	IEnvironmentSummary,
	IProjEnv,
} from '@sneat/datatug-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { EnvironmentService } from '@sneat/datatug-services-unsorted';
import { DatatugNavContextService } from '@sneat/datatug-services-nav';
import { IProjectContext } from '@sneat/datatug-nav';

@Component({
	selector: 'sneat-datatug-environment',
	templateUrl: './environment-page.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule],
})
export class EnvironmentPageComponent {
	projEnv?: IProjEnv;
	projBrief?: IDatatugProjectBriefWithIdAndStoreRef;

	project?: IProjectContext;
	env?: IEnvironmentSummary;
	dbCols = [{ field: 'id', sortable: true, filter: true }];
	public defaultBackUrl = '/store/localhost:8989';
	private envId?: string;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly envService: EnvironmentService,
		private readonly navController: NavController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly dataTugNavContextService: DatatugNavContextService,
	) {
		this.projEnv = history.state.projEnv as IProjEnv;

		this.dataTugNavContextService.currentProject.subscribe({
			next: (currentProject) => {
				this.project = currentProject;
				if (this.project) {
					if (!this.projBrief) {
						this.projBrief = {
							id: this.project.ref.projectId,
							access: 'private', // TODO pass actual
							title: 'TODO_pass_title',
							store: { ref: { type: 'agent' } },
						};
					}
					this.loadEnvSummary();
				}
			},
			error: (err) =>
				this.errorLogger.logError(
					err,
					'Failed to get current project for EnvironmentPage',
				),
		});
		this.dataTugNavContextService.currentEnv.subscribe((env) => {
			this.envId = env?.id;
			this.loadEnvSummary();
		});
		// this.route.paramMap.subscribe({
		// 	next: params => {
		// 		this.envId = params.get(routingParamEnvironmentId);
		// 		if (!this.projEnv || this.projEnv.id !== this.envId) {
		// 			this.projEnv = {id: this.envId};
		// 		}
		// 		this.loadEnvSummary();
		// 	}
		// });
	}

	goDbServer(envServer: IEnvDbServer): void {
		const obj = { ...envServer, id: envServer.host };
		this.goEnvSubPage(obj, 'servers/dbserver', { envServer });
	}

	// goDb(envDb: IEnvDatabaseSummary): void {
	// 	const {id} = envDb;
	// 	this.navController
	// 		.navigateForward(
	// 			`/project/${this.projBrief.id}/env/${this.projEnv.id}/db/${id}`, // TODO: relative path?
	// 			{
	// 				state: {
	// 					db: this.env.databases.find(db => db.id === id),
	// 				},
	// 			})
	// 		.catch(err => this.errorLogger.logError(err, 'Failed to navigate to db page'));
	// }

	private loadEnvSummary(): void {
		console.log('loadEnvSummary', this.project, this.envId);
		if (!this.project || !this.envId) {
			return;
		}
		this.envService.getEnvSummary(this.project.ref, this.envId).subscribe({
			next: (value) => (this.env = value),
			error: (err) =>
				this.errorLogger.logError(err, 'Failed to load environment summary'),
		});
	}

	private goEnvSubPage(
		envObject: { id: string },
		folder: string,
		state?: Record<string, unknown>,
	): void {
		const { id } = envObject;
		this.navController
			.navigateForward(
				`/project/${this.projBrief?.id}/env/${this.projEnv?.id}/${folder}/${id}`, // TODO: relative path?
				{ state },
			)
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to navigate to db page'),
			);
	}
}
