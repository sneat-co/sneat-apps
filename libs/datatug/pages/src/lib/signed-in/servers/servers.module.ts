import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServersPageRoutingModule } from './servers-routing.module';

import { ServersPageComponent } from './servers-page.component';
import { DatatugDbModalsAddDbServerModule } from '@sneat/datatug-db';

@NgModule({
	declarations: [ServersPageComponent],
})
export class ServersPageModule {}
