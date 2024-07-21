import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ForSpaceTypeCardComponent } from '../../components/for-space-type-card.component';

@Component({
	selector: 'sneat-for-educators',
	templateUrl: './for-educators.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, ForSpaceTypeCardComponent],
})
export class ForEducatorsComponent {}
