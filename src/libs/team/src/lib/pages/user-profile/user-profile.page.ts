import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {SneatUserService} from '@sneat/auth';
import {IUserRecord} from '@sneat/auth-models';

@Component({
	selector: 'sneat-user-profile',
	templateUrl: './user-profile.page.html',
	styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {

	public user: IUserRecord;
	public userTitle = new FormControl('', [Validators.required]);

	edit = false;

	constructor(
		private readonly userService: SneatUserService,
	) {
		userService.userRecord.subscribe(user => {
			console.log('UserProfilePage => user:', user);
			this.user = user?.data;
			this.userTitle.setValue(user?.data.title || '');
		})
	}

}
