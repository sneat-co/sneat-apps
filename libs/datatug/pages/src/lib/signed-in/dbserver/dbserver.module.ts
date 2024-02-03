import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DbserverPageRoutingModule } from './dbserver-routing.module';

import { DbserverPageComponent } from './dbserver-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, DbserverPageRoutingModule],
	declarations: [DbserverPageComponent],
})
export class DbserverPageModule {}
