import {NgModule} from '@angular/core';
import {SneatUserService} from './sneat-user.service';
import {SneatApiModule} from '@sneat/api';
import {PrivateTokenStoreService} from "./private-token-store.service";

@NgModule({
  imports: [
    SneatApiModule,
  ],
  providers: [
    SneatUserService,
    PrivateTokenStoreService,
  ]
})
export class SneatAuthModule {
}
