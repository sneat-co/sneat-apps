import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DataGridComponent } from '@sneat/datagrid';
import { DatatugBoardUiModule } from '@sneat/datatug-board-ui';
import { Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RecordsetValue } from '@sneat/datatug-dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { EntityService } from '@sneat/datatug-services-unsorted';
import {
	routingParamEntityId,
	routingParamProjectId,
	routingParamStoreId,
} from '@sneat/datatug-core';
import { EntityContentType, IEntity, IProjEntity } from '@sneat/datatug-models';
import { IGridColumn } from '@sneat/grid';

@Component({
	selector: 'sneat-datatug-entity',
	templateUrl: './entity-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugBoardUiModule,
		DataGridComponent,
	],
})
export class EntityPageComponent implements OnDestroy {
	storeId?: string;
	projectId?: string;
	entityId?: string;
	projEntity: IProjEntity;
	entity?: IEntity;
	public sourceIndex?: number;
	sourceData?: RecordsetValue[][];
	sourceCols?: IGridColumn[];
	private destroyed = new Subject<void>();

	constructor(
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly entityService: EntityService,
		readonly http: HttpClient,
	) {
		this.projEntity = history.state.entity;
		route.paramMap.pipe(takeUntil(this.destroyed)).subscribe((params) => {
			this.storeId = params.get(routingParamStoreId) || undefined;
			this.projectId = params.get(routingParamProjectId) || undefined;
			const entityId = params.get(routingParamEntityId) || undefined;
			this.entityId = entityId;
			if (!this.storeId || !this.projectId || !this.entityId) {
				return;
			}
			this.entityService
				.getEntity(this.storeId, this.projectId, this.entityId)
				.pipe(
					takeUntil(this.destroyed),
					takeWhile(() => this.entityId === entityId),
				)
				.subscribe({
					next: (entity) => {
						console.log('entity', entity);
						this.projEntity = entity;
						this.entity = entity.dto; // TODO: workaround cast
						const sourcesLen = entity.dto?.options?.sources?.length;
						if (!sourcesLen) {
							this.sourceIndex = undefined;
						} else if (
							(sourcesLen && this.sourceIndex === undefined) ||
							(this.sourceIndex !== undefined &&
								this.sourceIndex + 1 > sourcesLen)
						) {
							this.sourceIndex = 0;
							const source =
								entity.dto.options?.sources &&
								entity.dto.options?.sources[this.sourceIndex];
							if (!source) {
								return;
							}
							this.http
								.get<RecordsetValue[][]>(source.url)
								.pipe(takeUntil(this.destroyed))
								.subscribe({
									next: (rows) => {
										this.sourceData = rows;
										console.log('sourceData:', rows);
										this.sourceCols = [
											{ field: 'region', dbType: 'NVARCHAR', title: 'region' },
											{
												field: 'alpha-2',
												dbType: 'NVARCHAR',
												title: 'alpha-2',
											},
											{
												field: 'alpha-3',
												dbType: 'NVARCHAR',
												title: 'alpha-3',
											},
											{ field: 'name', dbType: 'NVARCHAR', title: 'name' },
										];
									},
									error: this.errorLogger.logErrorHandler(
										'Failed to get source data',
									),
								});
						}
					},
					error: (err) =>
						this.errorLogger.logError(err, 'Failed to get entity by id'),
				});
		});
	}

	protected getEntityContentType(): EntityContentType | undefined {
		if (this.sourceIndex === undefined || !this.entity?.options?.sources) {
			return undefined;
		}
		return this.entity.options.sources[this.sourceIndex].contentType;
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
