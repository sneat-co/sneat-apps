import {NgModule} from '@angular/core';
import {SneatTeamApiService} from './sneat-team-api.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    SneatTeamApiService,
  ]
})
export class SneatApiModule {
}
