import { Component, inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { ContactService } from '@sneat/contactus-services';
import { MemberBasePage } from '../member-base-page';

@Component({
  selector: 'sneat-member-removal',
  templateUrl: './member-removal-page.component.html',
})
export class MemberRemovalPageComponent extends MemberBasePage {
  private readonly navCtrl = inject(NavController);

  constructor() {
    super(inject(ContactService));
  }

  cancelMemberRemoval(): void {
    this.navCtrl.back();
  }

  removeMember(): void {
    this.errorLogger.logError(new Error('Not implemented yet'));
  }
}
