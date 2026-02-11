import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MemberContactsPageComponent } from './member-contacts-page.component';

const routes: Routes = [
  {
    path: '',
    component: MemberContactsPageComponent,
  },
];

@NgModule({
  imports: [FormsModule, RouterModule.forChild(routes)],
  declarations: [MemberContactsPageComponent],
})
export class MemberContactsPageModule {}
