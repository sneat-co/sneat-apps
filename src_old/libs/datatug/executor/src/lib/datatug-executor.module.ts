import { NgModule } from '@angular/core';
import { DatatugServicesStoreModule } from '@sneat/datatug/services/repo';
import { Coordinator } from './coordinator';

@NgModule({
	imports: [DatatugServicesStoreModule],
	providers: [Coordinator],
})
export class DatatugExecutorModule {
}
