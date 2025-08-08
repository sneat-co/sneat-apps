import { NgModule } from '@angular/core';
import { DatatugServicesStoreModule } from '../../services/repo/datatug-services-store.module';
import { DatatugBoardService } from './datatug-board.service';

@NgModule({
	imports: [DatatugServicesStoreModule],
	providers: [DatatugBoardService],
})
export class DatatugBoardCoreModule {}
