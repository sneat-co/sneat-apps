import { NgModule } from '@angular/core';
import { DatatugServicesStoreModule } from '../services/repo/datatug-services-store.module';
import { Coordinator } from './coordinator';

@NgModule({
  imports: [DatatugServicesStoreModule],
  providers: [Coordinator],
})
export class DatatugExecutorModule {}
