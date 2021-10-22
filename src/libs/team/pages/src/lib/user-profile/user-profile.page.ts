import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IUserRecord } from '@sneat/auth-models';
import { SneatUserService } from '@sneat/user';

@Component({
	selector: 'sneat-user-profile',
	templateUrl: './user-profile.page.html',
	styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {
	public user?: IUserRecord | null;
	public userTitle = new FormControl('', [Validators.required]);

	edit = false;

	constructor(private readonly userService: SneatUserService) {
		userService.userState.subscribe((userState) => {
			console.log('UserProfilePage => userState:', userState);
			this.user = userState.record;
			this.userTitle.setValue(userState?.record?.title || '');
		});
	}
}
