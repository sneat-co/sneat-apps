import { NgModule } from '@angular/core';
import { QueriesUiService } from './queries-ui.service';
import { DatatugQueriesServicesModule } from './datatug-queries-services.module';

@NgModule({
	imports: [DatatugQueriesServicesModule],
	providers: [QueriesUiService],
})
export class DatatugQueriesUiModule {}
