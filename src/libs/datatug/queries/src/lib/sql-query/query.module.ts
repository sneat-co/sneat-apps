import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SqlEditorPageRoutingModule} from './query-routing.module';

import {QueryPage} from './query-page.component';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {DatatugBoardModule} from '@sneat/datatug/board';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';
import {DatatugExecutorModule} from '@sneat/datatug/executor';
import {DatatugComponentsSqlEditorModule} from '@sneat/datatug/components/sqleditor';
import {QueriesServiceModule} from '@sneat/datatug/services/unsorted';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatatugComponentsSqlEditorModule,
    SqlEditorPageRoutingModule,
    CodemirrorModule,
    QueriesServiceModule,
    DatatugBoardModule,
    DatatugExecutorModule,
    DatatugComponentsDatagridModule,
  ],
  declarations: [
    QueryPage,
  ]
})
export class QueryPageModule {
}
