import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpacesCardComponent } from '@sneat/team-components';

@Component({
	selector: 'sneat-spaces-page',
	templateUrl: 'spaces-page.component.html',
	imports: [IonicModule, SpacesCardComponent],
})
export class SpacesPageComponent {}
