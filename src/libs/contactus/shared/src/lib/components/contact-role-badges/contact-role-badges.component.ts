import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
   selector: 'sneat-contact-role-badges',
   styles: [`
       ion-badge {
           font-weight: normal;
           opacity: 0.5;
       }
   `],
   template: '<ion-badge color="medium" *ngFor="let r of _roles" class="ion-margin-start">{{ r }}</ion-badge>',
   standalone: true,
   imports: [
      CommonModule,
      IonicModule,
   ],
})
export class ContactRoleBadgesComponent implements OnChanges {

   private readonly alwaysHide: readonly string[] = ['--', 'creator', 'contributor', 'owner'];

   @Input({ required: true }) roles?: readonly string[];
   @Input() hideRoles: readonly string[] = this.alwaysHide;

   private hiddenRoles = new Set<string>();
   protected _roles: readonly string[] = [];

   ngOnChanges(changes: SimpleChanges): void {
      if (changes['hideRoles']) {
         this.hiddenRoles = new Set([...this.hideRoles, ...this.alwaysHide]);
      }
      if (changes['roles'] || changes['hideRoles']) {
         this._roles = this.roles?.filter(r => !this.hiddenRoles.has(r)) || [];
      }
   }

}
