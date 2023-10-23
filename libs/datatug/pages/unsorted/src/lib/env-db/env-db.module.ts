import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvDbPageRoutingModule } from './env-db-routing.module';

import { EnvDbPageComponent } from './env-db-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, EnvDbPageRoutingModule],
	declarations: [EnvDbPageComponent],
})
export class EnvDbPageModule {}
