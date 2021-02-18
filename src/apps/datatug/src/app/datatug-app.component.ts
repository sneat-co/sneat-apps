import {Component} from '@angular/core';
import {AppComponentService} from '@sneat/app';
import {AppContextService} from '@sneat/datatug/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'sneat-root',
  templateUrl: 'datatug-app.component.html',
  styleUrls: ['datatug-app.component.scss'],
})
export class DatatugAppComponent {
  constructor(
    readonly appComponentService: AppComponentService,
    public readonly appContext: AppContextService,
    public readonly afAuth: AngularFireAuth,
  ) {
    appComponentService.initializeApp();
  }
}
