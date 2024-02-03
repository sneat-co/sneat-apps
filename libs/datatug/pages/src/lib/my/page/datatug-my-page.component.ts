import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatatugServicesBaseModule } from '@sneat/datatug-services-base';
import { DatatugServicesStoreModule } from '@sneat/datatug-services-repo';
import { MyPageRoutingModule } from '../my-routing.module';

@Component({
	selector: 'sneat-datatug-my',
	templateUrl: './datatug-my-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		MyPageRoutingModule,
		DatatugServicesBaseModule,
		DatatugServicesStoreModule,
	],
})
export class DatatugMyPageComponent {}
