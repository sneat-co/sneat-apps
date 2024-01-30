import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DatatugStoreService } from './datatug-store.service';
import { StoreApiService } from './store-api.service';
import { AgentStateService } from './agent-state.service';
import { AgentService } from './agent.service';
import { DatatugServicesBaseModule } from '@sneat/datatug-services-base';

@NgModule({
	imports: [HttpClientModule, DatatugServicesBaseModule],
	providers: [
		DatatugStoreService,
		StoreApiService,
		AgentService,
		AgentStateService,
	],
})
export class DatatugServicesStoreModule {}
