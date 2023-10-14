import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CopyListItemsPageComponent} from './copy-list-items-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [CopyListItemsPageComponent],
    exports: [CopyListItemsPageComponent]
})
export class CopyListItemsPageModule {
}
