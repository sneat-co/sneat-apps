import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {NewCardDialogComponent} from '../../modals/new-card-dialog/new-card-dialog.component';
import {IBoardContext, IBoardDef} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

@Component({
	selector: 'datatug-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
	@Input() boardDef: IBoardDef;
	@Input() boardContext: IBoardContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalCtrl: ModalController,
	) {
	}

	async newCard() {
		console.log('newCard()');
		const modal = await this.modalCtrl.create({component: NewCardDialogComponent})
		await modal.present();
		// try {
		// 	const id = Math.random().toString().split('.')[1];
		// 	if (!this.boardDef.rows) {
		// 		this.boardDef.rows = [];
		// 	}
		// 	this.boardDef.rows.push({
		// 		cards: [{
		// 			id,
		// 			title: 'New card',
		// 			widget: {id: 'sql-query', data: {text: 'select' + ' * from SomeTable'}}
		// 		}]
		// 	});
		// } catch (e) {
		// 	this.errorLogger.logError(e, 'Failed to create a new card');
		// }
	}
}
