import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RepoService} from './repo.service';
import {RepoProviderService} from './repo-provider.service';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    RepoService,
    RepoProviderService,
  ]
})
export class DatatugServicesRepoModule {
}
