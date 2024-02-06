import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'sneat-debtus-home-page',
	templateUrl: './debtus-home-page.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class DebtusHomePageComponent {}
