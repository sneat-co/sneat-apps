import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import {
  IBoardContext,
  IBoardDef,
} from '../../../../models/definition/board/board';
import { NewCardDialogComponent } from '../../modals/new-card-dialog/new-card-dialog.component';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { BoardRowComponent } from '../board-row/board-row.component';

@Component({
  selector: 'sneat-datatug-board',
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BoardRowComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonIcon,
    IonLabel,
  ],
})
export class BoardComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly modalCtrl = inject(ModalController);

  @Input() boardDef?: IBoardDef;
  @Input() boardContext?: IBoardContext;

  async newCard() {
// console.log('newCard()');
    const modal = await this.modalCtrl.create({
      component: NewCardDialogComponent,
    });
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
