import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreService} from './repo.service';
import {StoreApiService} from './store-api.service';
import {AgentStateService} from "./agent-state.service";
import {AgentService} from "./agent.service";

@NgModule({
	imports: [
		HttpClientModule,
	],
	providers: [
		StoreService,
		StoreApiService,
		AgentService,
		AgentStateService,
	]
})
export class DatatugServicesStoreModule {
}
