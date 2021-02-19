import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SqlQueriesPageRoutingModule} from './queries-routing.module';

import {QueriesPage} from './queries.page';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {DatatugBoardModule} from '@sneat/datatug/board';
import {QueriesServiceModule} from '@sneat/datatug/services/unsorted';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SqlQueriesPageRoutingModule,
        CodemirrorModule,
        QueriesServiceModule,
        DatatugBoardModule,
    ],
	declarations: [QueriesPage]
})
export class QueriesPageModule {
}
