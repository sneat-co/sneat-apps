import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ParameterLookupComponent} from './parameter-lookup.component';
import {ParameterLookupService} from './parameter-lookup.service';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';
import {DatatugComponentsSqlEditorModule} from '@sneat/datatug/components/sqleditor';
import {InputParametersComponent} from './input-parameters/input-parameters.component';
import {FormsModule} from "@angular/forms";

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		DatatugComponentsSqlEditorModule,
		DatatugComponentsDatagridModule,
	],
	declarations: [
		ParameterLookupComponent,
		InputParametersComponent,
	],
	providers: [
		ParameterLookupService,
	],
	exports: [InputParametersComponent]
})
export class DatatugComponentsParametersModule {
}
