import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RepoService} from './repo.service';
import {RepoApiService} from './repo-api.service';
import {AgentStateService} from "./agent-state.service";
import {AgentService} from "./agent.service";

@NgModule({
	imports: [
		HttpClientModule,
	],
	providers: [
		RepoService,
		RepoApiService,
		AgentService,
		AgentStateService,
	]
})
export class DatatugServicesRepoModule {
}
