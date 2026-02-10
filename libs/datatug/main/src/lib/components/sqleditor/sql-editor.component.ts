import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeEditor } from '@acrodata/code-editor';

@Component({
	selector: 'sneat-datatug-sql',
	templateUrl: './sql-editor.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, CodeEditor],
})
export class SqlEditorComponent {
	@Input() sql?: string;
	@Input() lineNumbers = false;
	@Input() readonly = true;

	@Output() sqlChanged = new EventEmitter<string>();

	public onSqlChanged(event: Event): void {
		event.stopPropagation();
		this.sqlChanged.emit(this.sql);
	}
}
