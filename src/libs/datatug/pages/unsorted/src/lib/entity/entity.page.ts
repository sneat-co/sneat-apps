import {Component, Inject, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, takeWhile} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {RecordsetValue} from '@sneat/datatug/dto';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {EntityService} from '@sneat/datatug/services/unsorted';
import {routingParamEntityId, routingParamProjectId, routingParamRepoId} from '@sneat/datatug/routes';
import {IEntity, IProjEntity} from '@sneat/datatug/models';
import {IGridColumn} from '@sneat/grid';

@Component({
	selector: 'datatug-entity',
	templateUrl: './entity.page.html',
})
export class EntityPage implements OnDestroy {

	repoId: string;
	projectId: string;
	entityId: string;
	projEntity: IProjEntity;
	entity: IEntity;
	public sourceIndex: number;
	sourceData: RecordsetValue[][];
	sourceCols: IGridColumn[];
	private destroyed = new Subject<void>();

	constructor(
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly entityService: EntityService,
		readonly http: HttpClient,
	) {
		this.projEntity = history.state.entity;
		route.paramMap
			.pipe(takeUntil(this.destroyed))
			.subscribe(params => {
				this.repoId = params.get(routingParamRepoId);
				this.projectId = params.get(routingParamProjectId);
				const entityId = params.get(routingParamEntityId);
				this.entityId = entityId;
				this.entityService.getEntity(this.repoId, this.projectId, this.entityId)
					.pipe(
						takeUntil(this.destroyed),
						takeWhile(() => this.entityId === entityId),
					)
					.subscribe({
						next: entity => {
							console.log('entity', entity);
							this.projEntity = entity;
							this.entity = entity.data; // TODO: workaround cast
							const sourcesLen = this.entity?.options?.sources.length;
							if (!sourcesLen) {
								this.sourceIndex = undefined
							} else if (sourcesLen && this.sourceIndex === undefined || this.sourceIndex + 1 > sourcesLen) {
								this.sourceIndex = 0;
								const source = this.entity.options.sources[this.sourceIndex];
								this.http
									.get<RecordsetValue[][]>(source.url)
									.pipe(takeUntil(this.destroyed))
									.subscribe({
										next: rows => {
											this.sourceData = rows;
											console.log('sourceData:', rows);
											this.sourceCols = [
												{field: 'region', dbType: 'NVARCHAR', title: 'region'},
												{field: 'alpha-2', dbType: 'NVARCHAR', title: 'alpha-2'},
												{field: 'alpha-3', dbType: 'NVARCHAR', title: 'alpha-3'},
												{field: 'name', dbType: 'NVARCHAR', title: 'name'},
											];
										},
										error: this.errorLogger.logErrorHandler('Failed to get source data'),
									});
							}
						},
						error: err => this.errorLogger.logError(err, 'Failed to get entity by id'),
					});
			});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
