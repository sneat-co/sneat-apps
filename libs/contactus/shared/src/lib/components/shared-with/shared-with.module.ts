import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedWithComponent } from './shared-with.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [SharedWithComponent],
    exports: [SharedWithComponent]
})
export class SharedWithModule {
}
