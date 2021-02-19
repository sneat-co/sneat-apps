import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component, Inject,
	Input,
	OnChanges, Output, EventEmitter,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

@Component({
	selector: 'datatug-sql',
	templateUrl: './sql-editor.component.html',
	styleUrls: ['./sql-editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlEditorComponent implements AfterViewInit, OnChanges {

	@Input() sql: string
	@Input() lineNumbers = false;
	@Input() readonly = true;

	@Output() sqlChanged = new EventEmitter<string>();

	@ViewChild('codemirrorComponent') public codemirrorComponent: CodemirrorComponent;

	public onSqlChanged(_: Event): void {
		this.sqlChanged.emit(this.sql);
	}

	public codemirrorOptions = {
		lineNumbers: this.lineNumbers,
		readOnly: this.readonly,
		mode: 'text/x-sql',
		viewportMargin: Infinity,
		style: {height: 'auto'},
	};

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	ngAfterViewInit(): void {
		const {codeMirror} = this.codemirrorComponent;
		codeMirror.getWrapperElement().style.height = 'auto';
		setTimeout(() => {
			this.refreshCodeMirror();
		}, 10);
	}

	refreshCodeMirror(): void {
		try {
			const {codeMirror} = this.codemirrorComponent;
			setTimeout(() => codeMirror.refresh(), 9);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup CodeMirror component');
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('SqlComponent.ngOnChanges()', changes);
		if ((changes.sql || changes.lineNumbers || changes.readonly) && this.codemirrorComponent) {
			this.codemirrorOptions = {...this.codemirrorOptions, lineNumbers: this.lineNumbers, readOnly: this.readonly};
			this.refreshCodeMirror();
		}
	}
}
