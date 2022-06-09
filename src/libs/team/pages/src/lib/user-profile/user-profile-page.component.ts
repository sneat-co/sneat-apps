import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SneatUserService } from '@sneat/auth';
import { IUserRecord } from '@sneat/auth-models';

@Component({
	selector: 'sneat-user-profile',
	templateUrl: './user-profile-page.component.html',
	styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent {
	public user?: IUserRecord | null;
	public userTitle = new FormControl<string>('', [Validators.required]);

	edit = false;

	constructor(private readonly userService: SneatUserService) {
		userService.userState.subscribe((userState) => {
			console.log('UserProfilePage => userState:', userState);
			this.user = userState.record;
			this.userTitle.setValue(userState?.record?.title || '');
		});
	}
}
