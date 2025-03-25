import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IBoardContext, IBoardRowDef } from '@sneat/ext-datatug-models';

@Component({
	selector: 'sneat-datatug-board-row',
	templateUrl: './board-row.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class BoardRowComponent {
	@Input() boardRowDef?: IBoardRowDef;
	@Input() boardContext?: IBoardContext;
}
