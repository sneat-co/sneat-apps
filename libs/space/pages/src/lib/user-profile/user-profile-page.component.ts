import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonBackButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';

@Component({
  selector: 'sneat-user-profile',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonBackButton,
  ],
})
export class UserProfilePageComponent {
  private readonly userService = inject(SneatUserService);

  public user?: IUserRecord | null;
  public userTitle = new FormControl<string>('', [Validators.required]);

  edit = false;

  constructor() {
    const userService = this.userService;

    userService.userState.subscribe((userState) => {
      console.log('UserProfilePage => userState:', userState);
      this.user = userState.record;
      this.userTitle.setValue(userState?.record?.title || '');
    });
  }
}
