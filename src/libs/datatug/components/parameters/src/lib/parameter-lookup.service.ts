import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ParameterLookupComponent} from './parameter-lookup.component';
import {share} from 'rxjs/operators';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {IParameterDef, IParameterValueWithoutName} from '@sneat/datatug/models';
import {AgentService, RepoService} from '@sneat/datatug/services/repo';

@Injectable()
export class ParameterLookupService {

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modal: ModalController,
		private readonly agentService: AgentService,
	) {
	}

	public lookupParameterValue(
		parameter: IParameterDef,
		repo: string,
		projectId: string,
		envId: string,
	): Observable<IParameterValueWithoutName> {
		const lookupResponse = this.agentService
			.select(repo, {
				proj: projectId,
				env: envId,
				db: parameter.lookup.db,
				sql: parameter.lookup.sql,
			}).pipe(
				share(), // Supposed to issue HTTP request immediately before modal component created
			);
		const subj = new Subject<IParameterValueWithoutName>();
		const canceled = () => {
			this.modal.dismiss().catch(err => this.errorLogger.logError(err, 'Failed to dismiss modal'));
		}
		this.modal.create({
			component: ParameterLookupComponent,
			componentProps: {parameter, agent: repo, projectId, envId, subj, canceled, lookupResponse},
		})
			.then(modal => modal.present())
			.catch(subj.error);
		return subj.asObservable();
	}
}
