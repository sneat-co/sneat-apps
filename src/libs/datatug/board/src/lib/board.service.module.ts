import {NgModule} from "@angular/core";
import {BoardService} from "./board.service";
import {DatatugServicesRepoModule} from "@sneat/datatug/services/repo";

@NgModule({
	imports: [
		DatatugServicesRepoModule,
	],
	providers: [
		BoardService,
	]
})
export class BoardServiceModule {
}
