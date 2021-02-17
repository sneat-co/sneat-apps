import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppComponentService} from './app-component.service';
import {SneatLoggingModule} from '@sneat/logging';
import {SneatAnalyticsModule} from '@sneat/analytics';

@NgModule({
  imports: [CommonModule],
  providers: [
    SneatLoggingModule,
    SneatAnalyticsModule,
    AppComponentService,
  ]
})
export class SneatAppModule {}
