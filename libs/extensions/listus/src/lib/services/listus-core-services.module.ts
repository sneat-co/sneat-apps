import { NgModule } from '@angular/core';
import { ListService } from './list.service';
import { IListusAppStateService, ListusAppStateService } from './listus-app-state.service';

@NgModule({
	providers: [
		ListService,
		{
			provide: IListusAppStateService,
			useClass: ListusAppStateService,
		}
	],
})
export class ListusCoreServicesModule {

}
