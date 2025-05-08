import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
	imports: [FormsModule, HomePageRoutingModule],
	declarations: [HomePage],
})
export class HomePageModule
{
}
