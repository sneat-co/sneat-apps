import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IonInput, ModalController } from '@ionic/angular';
import { share } from 'rxjs/operators';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IParameterDef, IParameterValueWithoutID } from '@sneat/datatug-models';
import { AgentService } from '@sneat/datatug-services-repo';
// import { ParameterLookupComponent } from "./parameter-lookup.component";

@Injectable()
export class ParameterLookupService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modal: ModalController,
		private readonly agentService: AgentService,
	) {}

	public lookupParameterValue(
		parameter: IParameterDef,
		repo: string,
		projectId: string,
		envId: string,
	): Observable<IParameterValueWithoutID> {
		if (!parameter?.lookup?.db) {
			throw new Error('parameter.lookup.db is not set');
		}
		const lookupResponse = this.agentService
			.select(repo, {
				proj: projectId,
				env: envId,
				db: parameter?.lookup?.db,
				sql: parameter?.lookup?.sql,
			})
			.pipe(
				share(), // Supposed to issue HTTP request immediately before modal component created
			);
		const subj = new Subject<IParameterValueWithoutID>();
		const canceled = () => {
			this.modal
				.dismiss()
				.catch((err) =>
					this.errorLogger.logError(err, 'Failed to dismiss modal'),
				);
		};
		this.modal
			.create({
				component: IonInput,
				componentProps: {
					parameter,
					agent: repo,
					projectId,
					envId,
					subj,
					canceled,
					lookupResponse,
				},
			})
			.then((modal) => modal.present())
			.catch(subj.error);
		return subj.asObservable();
	}
}
