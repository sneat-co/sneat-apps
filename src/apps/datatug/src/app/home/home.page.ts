import {Component, Inject} from '@angular/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

@Component({
  selector: 'sneat-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
  ) {
  }
}
