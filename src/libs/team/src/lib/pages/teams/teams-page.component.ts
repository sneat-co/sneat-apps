import {Component} from '@angular/core';

@Component({
  selector: 'app-teams-page',
  templateUrl: 'teams-page.component.html',
})
export class TeamsPage {
  constructor(
    // private readonly appContext: AppContextService,
  ) {
  }

  ionViewDidEnter(): void {
    // this.appContext.setCurrent(AppCode.DataTug);
  }
}
