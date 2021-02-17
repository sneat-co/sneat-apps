import {NgModule} from '@angular/core';
import {SneatTeamApiService} from './sneat-team-api.service';

@NgModule({
  imports: [
    // HttpClientModule,
  ],
  providers: [
    SneatTeamApiService,
  ]
})
export class SneatApiModule {
}
