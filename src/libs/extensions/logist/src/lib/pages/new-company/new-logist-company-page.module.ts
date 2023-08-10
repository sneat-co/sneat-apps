import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule, SelectFromListModule } from '@sneat/components';
import { LocationFormModule, NewCompanyFormModule } from '@sneat/contactus-shared';
import { NewLogistCompanyPageComponent } from './new-logist-company-page.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    LocationFormModule,
    SelectFromListModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewLogistCompanyPageComponent,
      },
    ]),
    CountrySelectorModule,
    NewCompanyFormModule,
  ],
	declarations: [
		NewLogistCompanyPageComponent,
	],
})
export class NewLogistCompanyPageModule {
}
