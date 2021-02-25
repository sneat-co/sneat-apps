import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    PrivateTokenStoreModule,
  ]
})
export class PrivateTokenStoreModule {

}
