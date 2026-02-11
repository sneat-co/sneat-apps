import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MemberBudgetPageComponent } from './member-budget-page.component';

const routes: Routes = [
  {
    path: '',
    component: MemberBudgetPageComponent,
  },
];

@NgModule({
  imports: [FormsModule, RouterModule.forChild(routes)],
  declarations: [MemberBudgetPageComponent],
})
export class MemberBudgetPageModule {}
