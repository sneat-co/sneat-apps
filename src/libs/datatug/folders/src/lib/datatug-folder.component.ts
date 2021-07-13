import {Component, Inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {DatatugFoldersService} from '@sneat/datatug/folders';
import {IProjectRef} from '@sneat/datatug/core';
import {takeUntil, tap} from 'rxjs/operators';
import {
	folderItemsAsList,
	IFolder,
	IOptionallyTitled,
	IProjItemBrief,
	ProjectItem,
	ProjectItemType
} from '@sneat/datatug/models';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {IRecord} from '@sneat/data';
import {DatatugNavService} from '@sneat/datatug/services/nav';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {EntityService, EnvironmentService, SchemaService} from '@sneat/datatug/services/unsorted';
import {BoardService} from '../../../board/src/lib/board.service';

@Component({
	selector: 'datatug-folder',
	templateUrl: 'datatug-folder.component.html',
})
export class DatatugFolderComponent implements OnChanges, OnDestroy {

	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Environment = ProjectItem.environment as const;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	readonly Board = ProjectItem.Board as const;
	readonly Query = ProjectItem.query as const;

	tabs = [
		'boards',
		'queries',
		'environments',
		'entities',
	]

	private destroyed = new Subject<void>();

	boards?: IProjItemBrief[];
	queries?: IProjItemBrief[];

	@Input() path = '~';
	@Input() projectRef?: IProjectRef;

	tab: 'boards' | 'queries' | 'environments' | 'entities' = 'boards'

	public folder?: IFolder | null;

	public getItemLink = (path: string) => (item: IProjItemBrief) => `${path}/${item.id}`;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly foldersService: DatatugFoldersService,
		private readonly datatugNavService: DatatugNavService,
		private readonly schemaService: SchemaService,
		private readonly environmentService: EnvironmentService,
		private readonly boardService: BoardService,
		private readonly entityService: EntityService,
	) {
		// foldersService.watchFolder()
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.projectRef) {
			this.subscribeForFolder();
		}
	}

	public createBoard = (title: string) =>
		this.createProjItem(ProjectItem.Board, title, this.boardService.createNewBoard)

	public createQuery = (title: string) =>
		alert('Not implemented yet.')

	public createEnvironment = (title: string) =>
		this.createProjItem(ProjectItem.environment, title, this.environmentService.createEnvironment)

	public createSchema = (title: string) => this.createProjItem(ProjectItem.dbModel, title,
		this.schemaService.createSchema)

	private createProjItem<T extends IOptionallyTitled>(
		projItemType: ProjectItem,
		name: string,
		create: (request: CreateNamedRequest) => Observable<IRecord<T>>,
	): Observable<IRecord<T>> {
		console.log('createProjItem()', projItemType, name);
		if (!this.projectRef) {
			return throwError('projectRef is not set');
		}
		return create({projectRef: this.projectRef, name: name.trim()})
			.pipe(
				tap(value => {
					console.log('project item created:', value);
					try {
						// if (!this.project.summary.environments) {
						// 	this.project = {
						// 		...this.project,
						// 		summary: {...this.project.summary, environments: []},
						// 	}
						// }
						const projItemBrief = {id: value.id, title: value.data?.title};
						// this.project.environments.push(projItemBrief)
						this.goProjItemPage(projItemType, projItemBrief);
					} catch (err) {
						this.errorLogger.logError(err, 'Failed to process API response');
					}
				}),
				// catchError(err => {
				// 	this.errorLogger.logError(err, 'Failed to create ' + projItemType);
				// 	return throwError(err);
				// }),
			);
	}

	private goProjItemPage(page: ProjectItemType, projItem: IProjItemBrief): void {
		console.log('goProjItemPage()', page, projItem, this.projectRef);
		if (!this.projectRef) {
			throw new Error('projectRef is not set');
		}
		switch (page) {
			case ProjectItem.environment:
				page = 'env' as ProjectItemType;
				break;
		}
		this.datatugNavService.goProjPage(
			{ref: this.projectRef}, page,
			{projectContext: {ref: this.projectRef}},
		);
	}

	private subscribeForFolder(): void {
		if (this.projectRef) {
			this.foldersService.watchFolder({...this.projectRef, id: this.path})
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: folder => {
						this.folder = folder;
						this.boards = folder?.boards ? folderItemsAsList(folder.boards).map(v => ({
							id: v.id,
							title: v.name
						})) : [];
						console.log('DatatugFolderComponent => folder:', folder);
					}
				});
		}
	}
}
