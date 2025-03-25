import { NgModule } from '@angular/core';
import { DatatugServicesStoreModule } from '@sneat/ext-datatug-services-repo';
import { DatatugBoardService } from './datatug-board.service';

@NgModule({
	imports: [DatatugServicesStoreModule],
	providers: [DatatugBoardService],
})
export class DatatugBoardCoreModule {}
