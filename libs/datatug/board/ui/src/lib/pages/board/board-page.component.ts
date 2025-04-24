import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonMenuButton,
	IonRow,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	projectRefToString,
	QueryParamsService,
	routingParamBoard,
} from '@sneat/ext-datatug-core';
import {
	IBoardContext,
	IBoardDef,
	IParamWithDefAndValue,
	IProjBoard,
} from '@sneat/ext-datatug-models';
import { DatatugNavContextService } from '@sneat/ext-datatug-services-nav';
import { ParameterLookupService } from '@sneat/ext-datatug-components-parameters';
import { DatatugBoardService } from '@sneat/ext-datatug-board-core';
import { BoardComponent } from '../../components/board/board.component';
import { EnvSelectorComponent } from '../../components/env-selector/env-selector.component';

@Component({
	selector: 'sneat-datatug-board-page',
	templateUrl: './board-page.component.html',
	imports: [
		FormsModule,
		// BoardServiceModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonMenuButton,
		IonTitle,
		IonContent,
		IonGrid,
		IonRow,
		IonCol,
		IonButton,
		IonIcon,
		IonLabel,
		IonCard,
		IonItem,
		IonInput,
		EnvSelectorComponent,
		BoardComponent,
	],
	providers: [QueryParamsService],
})
export class BoardPageComponent implements OnInit, OnDestroy {
	boardId?: string | null;

	projBoard?: IProjBoard;

	boardDef?: IBoardDef;

	parameters?: IParamWithDefAndValue[];

	defaultHref?: string;
	envId?: string | null = 'LOCAL';
	projectId?: string;
	storeId?: string;

	boardContext: IBoardContext = { parameters: {}, mode: 'view' };
	private readonly destroyed$ = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly boardService: DatatugBoardService,
		private readonly route: ActivatedRoute,
		private readonly lookupService: ParameterLookupService,
		private readonly dataTugNavContext: DatatugNavContextService,
		private readonly queryParamsService: QueryParamsService,
	) {
		console.log('BoardPage.constructor()');
		this.projBoard = history.state?.projBoard;
		try {
			this.route.queryParamMap.subscribe({
				next: (queryParamMap) => {
					console.log('BoardPage: queryParamMap =>', queryParamMap);
					this.envId = queryParamMap.get('env');
					if (this.envId) {
						this.dataTugNavContext.setCurrentEnvironment(this.envId);
					}
				},
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to get query parameters'),
			});
			dataTugNavContext.currentEnv
				.pipe(takeUntil(this.destroyed$.asObservable()))
				.subscribe({
					next: (env) => {
						console.log('BoardPage got current environment:', env);
						this.envId = env?.id;
						if (this.envId) {
							this.queryParamsService.setQueryParameter('env', this.envId);
						}
					},
					error: (e) =>
						this.errorLogger.logError(
							e,
							'Failed on getting current environment',
						),
				});
			dataTugNavContext.currentProject
				.pipe(
					filter((p) => !!p?.ref),
					map((p) => projectRefToString(p?.ref)),
					distinctUntilChanged(),
					filter((p) => !!p),
				)
				.subscribe((p) => {
					if (p) {
						[this.storeId, this.projectId] = p.split('/');
					}
					console.log(
						'this.store, this.projectId',
						p,
						this.storeId,
						this.projectId,
					);
					this.route.paramMap.subscribe((params) => {
						this.boardId = params.get(routingParamBoard);
						try {
							if (!this.projectId) {
								throw new Error('projectId is ' + this.projectId);
							}
							if (!this.boardId) {
								throw new Error('boardId is ' + this.boardId);
							}
							this.boardService
								.getBoard('http://localhost:8989', this.projectId, this.boardId)
								.subscribe({
									next: (board) => {
										try {
											console.log('Loaded board:', board);
											this.projBoard = board;
											this.boardDef = board;
											this.parameters = board.parameters?.map((def) => ({
												def,
												val: '',
											}));
										} catch (e) {
											this.errorLogger.logError(
												e,
												'Failed to process board response',
											);
										}
									},
									error: (err) =>
										this.errorLogger.logError(err, 'Failed to get board'),
								});
						} catch (e) {
							this.errorLogger.logError(
								e,
								'Failed to request board definition',
							);
						}
					});
				});
			dataTugNavContext.currentEnv.subscribe({
				next: (env) => {
					console.log('currentEnv: ', env);
					this.envId = env?.id;
				},
				error: (err) =>
					this.errorLogger.logError(err, 'Failed process current environment'),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed in BoardPage.constructor()');
		}
	}

	public startEditing(): void {
		this.boardContext = { ...this.boardContext, mode: 'edit' };
	}

	public saveChanges(): void {
		this.boardContext = { ...this.boardContext, mode: 'view' };
	}

	ngOnInit() {
		try {
			this.defaultHref = location.pathname.split('/').slice(0, -1).join('/');
		} catch (e) {
			this.errorLogger.logError(e, 'Failed in BoardPage.ngOnInit()');
		}
	}

	lookup(p: IParamWithDefAndValue): void {
		if (!this.storeId) {
			return;
		}
		if (!this.projectId) {
			return;
		}
		if (!this.envId) {
			return;
		}
		this.lookupService
			.lookupParameterValue(p.def, this.storeId, this.projectId, this.envId)
			.subscribe({
				next: (v) => {
					console.log('Looked up:', v);
					p.val = v.value;
					this.boardContext = {
						...this.boardContext,
						parameters: { ...this.boardContext.parameters, [p.def.id]: v },
					};
				},
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to lookup parameter value'),
			});
	}

	ngOnDestroy(): void {
		try {
			if (this.destroyed$) {
				this.destroyed$.next();
				this.destroyed$.complete();
			}
		} catch (err) {
			this.errorLogger.logError(err, 'Failed to destroy BoarPageComponent');
		}
	}
}
