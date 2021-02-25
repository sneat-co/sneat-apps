import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sql/sql';

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
  public codemirrorOptions = {
    lineNumbers: this.lineNumbers,
    readOnly: this.readonly,
    mode: 'text/x-mssql',
    viewportMargin: Infinity,
    style: {height: 'auto'},
  };

  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
  ) {
  }

  public onSqlChanged(_: Event): void {
    this.sqlChanged.emit(this.sql);
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
    if (changes.sql || changes.lineNumbers || changes.readonly) {
      this.codemirrorOptions = {
        ...this.codemirrorOptions,
        lineNumbers: this.lineNumbers,
        readOnly: this.readonly
      };
      console.log('codemirrorOptions:', this.codemirrorOptions);
      if (this.codemirrorComponent) {
        this.refreshCodeMirror();
      }
    }
  }
}
