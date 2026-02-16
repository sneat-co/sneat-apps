import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISqlChanged } from '../intefaces';
import {
  ICanJoin,
  QueryContextSqlService,
} from '../../../query-context-sql.service';

@Component({
  selector: 'sneat-datatug-qe-joins',
  templateUrl: 'joins.component.html',
  imports: [
    IonCheckbox,
    IonCard,
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonBadge,
    IonButtons,
    IonButton,
    IonIcon,
    IonText,
    JsonPipe,
  ],
})
export class JoinsComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  readonly queryContextSqlService = inject(QueryContextSqlService);

  @Input() public sql?: string;
  @Input() public queryAst?: IAstQuery;
  @Input() public sqlParser?: SqlParser;
  @Output() public astChanged = new EventEmitter<ISqlChanged>();

  public suggestedJoins?: ICanJoin[];

  constructor() {
    const queryContextSqlService = this.queryContextSqlService;

    queryContextSqlService.suggestedJoins.subscribe({
      next: (suggestedJoins) => {
        this.suggestedJoins = suggestedJoins;
      },
      error: this.errorLogger.logErrorHandler('failed to get suggested join'),
    });
  }

  public joinCheckChanged(event: Event, join: IAstJoin): void {
    // console.log('joinCheckChanged', event, join);
    const ce = event as CustomEvent;
    const checked = !!ce.detail.checked;
    if (this.sql) {
      if (checked) {
        this.sql = this.sqlParser?.uncommentJoin(this.sql, join);
      } else {
        this.sql = this.sqlParser?.commentOutJoin(this.sql, join);
      }
    }
    this.queryAst = this.sql ? this.sqlParser?.parseQuery(this.sql) : undefined;
    this.astChanged.emit({ sql: this.sql || '', ast: this.queryAst || {} });
  }

  public addJoin(join: ICanJoin, type: 'left' | 'right' | 'inner'): void {
    alert(`Not implemented yet ${join} ${type}`);
  }
}
