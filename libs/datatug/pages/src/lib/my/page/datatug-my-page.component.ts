import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatatugServicesBaseModule } from '@sneat/datatug-services-base';
import { DatatugServicesStoreModule } from '@sneat/datatug-services-repo';

@Component({
	selector: 'sneat-datatug-my',
	templateUrl: './datatug-my-page.component.html',
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugServicesBaseModule,
		DatatugServicesStoreModule,
	],
})
export class DatatugMyPageComponent {}
