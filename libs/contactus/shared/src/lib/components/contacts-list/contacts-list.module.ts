import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
	CountryFlagPipe,
	CountryTitle,
	GenderIconNamePipe,
	PersonTitle,
} from '@sneat/components';
import { ContactsListItemComponent } from '../contacts-list-item/contacts-list-item.component';
import { ContactsListComponent } from './contacts-list.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		CountryTitle,
		CountryFlagPipe,
		PersonTitle,
		GenderIconNamePipe,
	],
	declarations: [ContactsListComponent, ContactsListItemComponent],
	exports: [ContactsListComponent, ContactsListItemComponent],
})
export class ContactsListModule {}
