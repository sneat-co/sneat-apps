import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ParameterLookupComponent} from './parameter-lookup.component';
import {ParameterLookupService} from './parameter-lookup.service';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';
import {DatatugComponentsSqlEditorModule} from '@sneat/datatug/components/sqleditor';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DatatugComponentsSqlEditorModule,
    DatatugComponentsDatagridModule,
  ],
  declarations: [
    ParameterLookupComponent,
  ],
  providers: [
    ParameterLookupService,
  ]
})
export class DatatugComponentsParametersModule {}
