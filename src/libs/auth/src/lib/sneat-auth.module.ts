import {NgModule} from '@angular/core';
import {SneatUserService} from './sneat-user.service';
import {SneatApiModule} from '@sneat/api';

@NgModule({
  imports: [
    SneatApiModule,
  ],
  providers: [
    SneatUserService,
  ]
})
export class SneatAuthModule {
}
