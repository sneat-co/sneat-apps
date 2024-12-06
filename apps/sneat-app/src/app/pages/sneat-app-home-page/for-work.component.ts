import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ForSpaceTypeCardComponent } from '../../components/for-space-type-card.component';

@Component({
	selector: 'sneat-for-work',
	templateUrl: './for-work.component.html',
	imports: [CommonModule, IonicModule, ForSpaceTypeCardComponent],
})
export class ForWorkComponent {}
