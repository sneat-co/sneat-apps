import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorComponent, CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

// import { javascript, sql } from '@codemirror/lang-javascript';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/mode/sql/sql';

@Component({
	selector: 'sneat-datatug-sql',
	templateUrl: './sql-editor.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, CodemirrorModule],
})
export class SqlEditorComponent implements AfterViewInit, OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	@Input() sql?: string;
	@Input() lineNumbers = false;
	@Input() readonly = true;

	@Output() sqlChanged = new EventEmitter<string>();

	@ViewChild('codemirrorComponent')
	public codemirrorComponent?: CodemirrorComponent;
	public codemirrorOptions = {
		lineNumbers: this.lineNumbers,
		readOnly: this.readonly,
		mode: 'text/x-mssql',
		viewportMargin: Infinity,
		style: { height: 'auto' },
	};

	public onSqlChanged(event: Event): void {
		event.stopPropagation();
		this.sqlChanged.emit(this.sql);
	}

	ngAfterViewInit(): void /* Intentionally not ngOnInit */ {
		if (!this.codemirrorComponent) {
			return;
		}
		const { codeMirror } = this.codemirrorComponent;
		if (!codeMirror) {
			return;
		}
		codeMirror.getWrapperElement().style.height = 'auto';
		setTimeout(() => {
			this.refreshCodeMirror();
		}, 100);
	}

	refreshCodeMirror(): void {
		console.log('refreshCodeMirror()');
		try {
			if (!this.codemirrorComponent) {
				return;
			}
			const { codeMirror } = this.codemirrorComponent;
			if (!codeMirror) {
				return;
			}
			setTimeout(() => {
				try {
					codeMirror.refresh();
				} catch (e) {
					this.errorLogger.logError(e, 'Failed to call codeMirror.refresh()');
				}
			}, 9);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup CodeMirror component');
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('SqlComponent.ngOnChanges()', changes);
		if (changes['sql'] || changes['lineNumbers'] || changes['readonly']) {
			this.codemirrorOptions = {
				...this.codemirrorOptions,
				lineNumbers: this.lineNumbers,
				readOnly: this.readonly,
			};
			// console.log('codemirrorOptions:', this.codemirrorOptions);
			if (this.codemirrorComponent) {
				this.refreshCodeMirror();
			}
		}
	}
}
