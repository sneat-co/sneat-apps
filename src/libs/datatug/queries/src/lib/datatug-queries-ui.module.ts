import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QueriesUiService } from './queries-ui.service';
import { DatatugQueriesServicesModule } from '@sneat/datatug/queries';

@NgModule({
	imports: [IonicModule, DatatugQueriesServicesModule],
	providers: [QueriesUiService],
})
export class DatatugQueriesUiModule {}
