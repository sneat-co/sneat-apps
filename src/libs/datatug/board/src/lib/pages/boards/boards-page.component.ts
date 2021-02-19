import {Component, Inject, OnInit} from '@angular/core';
import {BoardService} from '../../board.service';
import {AlertController} from '@ionic/angular';
import {IProjBoard, IProjItemBrief} from '@sneat/datatug/models';
import {IDatatugProjectContext} from '@sneat/datatug/nav';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

@Component({
	selector: 'datatug-databoards',
	templateUrl: './boards-page.component.html',
})
export class BoardsPage implements OnInit {

	tab = 'shared';
	noItemsText: string;

	boards: IProjBoard[];
	defaultHref: string;
	currentProject: IDatatugProjectContext;

	constructor(
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly datatugNavService: DatatugNavService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly boardService: BoardService,
		private readonly alertCtrl: AlertController,
	) {
		this.tabChanged(this.tab);
		this.datatugNavContextService.currentProject.subscribe({
			next: currentProject => {
				try {
					this.currentProject = currentProject;
					this.boards = currentProject?.summary?.boards || [];
				} catch (e) {
					this.errorLogger.logError(e, 'Failed to process current project in Boards page');
				}
			},
			error: err => this.errorLogger.logError(err, 'Failed to get current project at Boards page'),
		});
	}

	public getLinkToBoard = (item: IProjItemBrief) => this.datatugNavService.projectPageUrl(this.currentProject, 'board', item.id);

	ngOnInit() {
		this.defaultHref = location.pathname.split('/').slice(0, -1).join('/') + 's';
	}

	public goBoard(item: IProjBoard): void {
		this.datatugNavService.goBoard(this.currentProject, item);
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
				}
			],
			buttons: [
				{
					role: 'cancel',
					text: 'Cancel',
					cssClass: 'ion-color-medium',
				},
				{
					text: 'Create',
					handler: value => {
						console.log('alert value:', value);
						this.boardService
							.createNewBoard(this.currentProject.repoId, this.currentProject.brief.id, value.title as string)
							.subscribe({
								next: board => {
									console.log('Board created:', board);
									this.boards.push(board);
								},
								error: this.logError(() => `Failed to create a new board with title [${value.title}]`),
							});
					}
				},
			]
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

	private logError = (message: () => string) => err => this.errorLogger.logError(err, message());
}
