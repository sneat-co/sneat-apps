import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyrightComponent } from './components/copyright/copyright.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CopyrightComponent],
  exports: [CopyrightComponent],
})
export class CoreModule {}
