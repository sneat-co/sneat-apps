import { NgModule } from '@angular/core';
import { NavService } from './services/nav.service';
import { QueryParamsService } from './services/QueryParamsService';

@NgModule({
  providers: [
    // AppContextService,
    NavService,
    QueryParamsService,
  ],
})
export class DatatugCoreModule {}
