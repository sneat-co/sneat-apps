import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
	selector: 'sneat-datatug-widgets',
	templateUrl: './widgets-page.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule],
})
export class WidgetsPageComponent {}
