import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppContextService} from './services/app-context.service';
import {NavService} from './services/nav.service';
import {QueryParamsService} from './services/QueryParamsService';

@NgModule({
  imports: [CommonModule],
  providers: [
    AppContextService,
    NavService,
    QueryParamsService,
  ]
})
export class DatatugCoreModule {
}
