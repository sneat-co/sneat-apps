import { NgModule } from '@angular/core';
import {
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { DatatugStoreService } from './datatug-store.service';
import { StoreApiService } from './store-api.service';
import { AgentStateService } from './agent-state.service';
import { AgentService } from './agent.service';

@NgModule({
	providers: [
		provideHttpClient(withInterceptorsFromDi()),
		DatatugStoreService,
		StoreApiService,
		AgentService,
		AgentStateService,
	],
})
export class DatatugServicesStoreModule {}
