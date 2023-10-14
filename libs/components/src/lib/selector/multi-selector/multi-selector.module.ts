import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MultiSelectorComponent } from './multi-selector.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    MultiSelectorComponent,
  ],
  exports: [
    MultiSelectorComponent,
  ],
})
export class MultiSelectorModule {
}
