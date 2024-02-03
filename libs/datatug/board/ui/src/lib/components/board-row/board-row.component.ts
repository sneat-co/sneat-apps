import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IBoardContext, IBoardRowDef } from '@sneat/datatug-models';

@Component({
	selector: 'sneat-datatug-board-row',
	templateUrl: './board-row.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardRowComponent {
	@Input() boardRowDef?: IBoardRowDef;
	@Input() boardContext?: IBoardContext;
}
