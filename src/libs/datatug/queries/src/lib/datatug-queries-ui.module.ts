import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QueriesUiService } from './queries-ui.service';
import { DatatugQueriesServicesModule } from './datatug-queries-services.module';

@NgModule({
	imports: [
		IonicModule,
		DatatugQueriesServicesModule,
	],
	providers: [QueriesUiService],
})
export class DatatugQueriesUiModule {
}
