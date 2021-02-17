import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorLogger} from './error-logger.interface';
import {ErrorLoggerService} from './error-logger.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: ErrorLogger,
      useClass: ErrorLoggerService,
    },
  ]
})
export class LoggingModule {
}
