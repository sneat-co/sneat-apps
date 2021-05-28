import {NgModule} from "@angular/core";
import {BoardService} from "./board.service";
import {DatatugServicesStoreModule} from "@sneat/datatug/services/repo";

@NgModule({
	imports: [
		DatatugServicesStoreModule,
	],
	providers: [
		BoardService,
	]
})
export class BoardServiceModule {
}
