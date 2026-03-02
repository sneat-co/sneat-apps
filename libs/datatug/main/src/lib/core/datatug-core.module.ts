import { NgModule } from '@angular/core';
import { QueryParamsService } from './services/QueryParamsService';

@NgModule({
  providers: [
    // AppContextService,
    QueryParamsService,
  ],
})
export class DatatugCoreModule {}
