import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {
	folderItemsAsList,
	IFolder,
	IProjBoard,
	IProjItemBrief,
} from '@sneat/datatug-models';
import { IProjectContext } from '@sneat/datatug/nav';
import {
	DatatugNavContextService,
	DatatugNavService,
} from '@sneat/datatug-services-nav';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatatugBoardService } from '@sneat/datatug/board/core';
import { DatatugFoldersService } from '@sneat/datatug/folders/core';

@Component({
	selector: 'datatug-boards',
	templateUrl: './boards-page.component.html',
})
export class BoardsPageComponent implements OnInit, OnDestroy {
	tab = 'shared';
	noItemsText?: string;

	boards?: IProjBoard[];
	defaultHref?: string;
	project?: IProjectContext;

	folderPath = '~';

	private readonly destroyed = new Subject<void>();

	constructor(
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly datatugNavService: DatatugNavService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly boardService: DatatugBoardService,
		private readonly alertCtrl: AlertController,
		private readonly foldersService: DatatugFoldersService,
	) {
		this.tabChanged(this.tab);
		this.datatugNavContextService.currentProject
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: (currentProject) => {
					try {
						this.setProject(currentProject);
						// this.project = currentProject;
						// this.boards = currentProject?.summary?.boards || [];
					} catch (e) {
						this.errorLogger.logError(
							e,
							'Failed to process current project in Boards page',
						);
					}
				},
				error: (err) =>
					this.errorLogger.logError(
						err,
						'Failed to get current project at Boards page',
					),
			});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	private setProject(project: IProjectContext): void {
		const path = this.folderPath;
		if (
			project?.ref?.projectId &&
			project.ref.projectId !== this.project?.ref?.projectId
		) {
			this.foldersService
				.watchFolder({ ...project.ref, id: path })
				.pipe(takeUntil(this.destroyed))
				.subscribe((folder) => this.onFolderReceived(path, folder));
		}
		this.project = project;
	}

	private onFolderReceived = (path: string, folder?: IFolder | null): void => {
		console.log('onFolderReceived', path, folder);
		if (this.folderPath !== path) {
			return;
		}
		this.boards = [];
		if (folder?.boards) {
			this.boards = folderItemsAsList(folder.boards);
		}
	};

	public getLinkToBoard = (item: IProjItemBrief) =>
		this.project &&
		this.datatugNavService.projectPageUrl(this.project.ref, 'board', item.id);

	ngOnInit() {
		this.defaultHref =
			location.pathname.split('/').slice(0, -1).join('/') + 's';
	}

	public goBoard(item: IProjBoard): void {
		if (this.project) {
			this.datatugNavService.goBoard(this.project, item);
		}
	}

	async newBoard(): Promise<void> {
		const modal = await this.alertCtrl.create({
			message: 'New board',
			inputs: [
				{
					name: 'title',
					type: 'text',
					// handler: v => {
					// 	console.log('input handler:', v);
					// },
					placeholder: 'Name, should be unique',
				},
			],
			buttons: [
				{
					role: 'cancel',
					text: 'Cancel',
					cssClass: 'ion-color-medium',
				},
				{
					text: 'Create',
					handler: (value) => {
						console.log('alert value:', value);
						// const store: IProjStoreRef = {
						// 	type: 'firestore',
						// };
						if (!this.project) {
							return;
						}
						this.boardService
							.createNewBoard({
								projectRef: this.project.ref,
								name: value.title as string,
							})
							.subscribe({
								next: (board) => {
									console.log('Board created:', board);
									this.boards?.push(board);
								},
								error: this.logError(
									() =>
										`Failed to create a new board with title [${value.title}]`,
								),
							});
					},
				},
			],
		});
		await modal.present();
	}

	public tabChanged(tab: string): void {
		this.tab = tab;
		switch (tab) {
			case 'favorite':
				this.noItemsText = 'No favorite boards';
				break;
			case 'personal':
				this.noItemsText = 'No personal boards';
				break;
			case 'shared':
				this.noItemsText = 'No shared boards';
				break;
			default:
				this.noItemsText = 'No boards';
		}
	}

	private logError = (message: () => string) => (err: unknown) =>
		this.errorLogger.logError(err, message());
}
