import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";

@Component({
	selector: 'datatug-menu',
	templateUrl: './datatug-menu.component.html',
})
export class DatatugMenuComponent {

	constructor(
		public readonly afAuth: AngularFireAuth,
	) {
	}

}
