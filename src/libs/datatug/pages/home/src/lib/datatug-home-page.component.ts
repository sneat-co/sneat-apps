import {Component, Inject} from '@angular/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

@Component({
  selector: 'sneat-home',
  templateUrl: 'datatug-home-page.component.html',
})
export class DatatugHomePageComponent {
  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
  ) {
  }
}
