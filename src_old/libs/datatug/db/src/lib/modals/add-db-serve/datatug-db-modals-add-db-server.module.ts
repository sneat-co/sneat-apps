import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDbServerComponent } from './add-db-server.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule],
	declarations: [AddDbServerComponent],
	exports: [AddDbServerComponent],
})
export class DatatugDbModalsAddDbServerModule {
}
