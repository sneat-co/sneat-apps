import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreService} from './repo.service';
import {RepoApiService} from './repo-api.service';
import {AgentStateService} from "./agent-state.service";
import {AgentService} from "./agent.service";

@NgModule({
	imports: [
		HttpClientModule,
	],
	providers: [
		StoreService,
		RepoApiService,
		AgentService,
		AgentStateService,
	]
})
export class DatatugServicesRepoModule {
}
