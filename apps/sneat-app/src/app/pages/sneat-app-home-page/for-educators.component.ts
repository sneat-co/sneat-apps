import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ForTeamTypeCardComponent } from '../../components/for-team-type-card.component';

@Component({
	selector: 'sneat-for-educators',
	templateUrl: './for-educators.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, ForTeamTypeCardComponent],
})
export class ForEducatorsComponent {}
