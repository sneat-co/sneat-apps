import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonCol, IonRow } from '@ionic/angular/standalone';
import {
	IBoardContext,
	IBoardRowDef,
} from '../../../../models/definition/board/board';
import { BoardCardComponent } from '../board-card/board-card.component';

@Component({
	selector: 'sneat-datatug-board-row',
	templateUrl: './board-row.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IonCol, IonRow, BoardCardComponent],
})
export class BoardRowComponent {
	@Input() boardRowDef?: IBoardRowDef;
	@Input() boardContext?: IBoardContext;
}
