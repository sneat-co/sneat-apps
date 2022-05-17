import { Component } from '@angular/core';
import { Gender } from '@sneat/dto';

@Component({
	selector: 'sneat-person-form',
	templateUrl: 'person-form.component.html',
})
export class PersonFormComponent {
	gender?: Gender;
}
