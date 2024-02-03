import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CopyrightComponent } from '@sneat/components';
import { NewProjectFormComponent } from '@sneat/datatug-project';
import { DatatugServicesBaseModule } from '@sneat/datatug-services-base';
import { DatatugServicesStoreModule } from '@sneat/datatug-services-repo';
import { WormholeModule } from '@sneat/wormhole';
import { HomePageRoutingModule } from './home-routing.module';
import { MyDatatugProjectsComponent } from './my-projects';
import { MyStoresComponent } from './my-stores';
// import {
// 	GuiColumn,
// 	GuiColumnAlign,
// 	GuiColumnMenu,
// 	GuiInfoPanel,
// 	GuiSearching,
// 	GuiSorting,
// } from '@generic-ui/ngx-grid';

@Component({
	selector: 'sneat-datatug-home',
	templateUrl: 'datatug-home-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		// CoreModule,
		WormholeModule,
		DatatugServicesBaseModule,
		DatatugServicesStoreModule,
		NewProjectFormComponent,
		// GuiGridModule,
		CopyrightComponent,
		MyDatatugProjectsComponent,
		MyStoresComponent,
	],
})
export class DatatugHomePageComponent {
	// infoPanel: GuiInfoPanel = {
	// 	enabled: true,
	// 	infoDialog: true,
	// 	columnsManager: true,
	// };
	//
	// searching: GuiSearching = {
	// 	enabled: true,
	// 	placeholder: 'Search',
	// };
	//
	// sorting: GuiSorting = {
	// 	enabled: true,
	// 	multiSorting: true,
	// };
	//
	// columnMenu: GuiColumnMenu = {
	// 	enabled: true,
	// 	sort: true,
	// 	columnsManager: true,
	// };
	//
	// columns: Array<GuiColumn> = [
	// 	{
	// 		header: 'Name',
	// 		field: 'name',
	// 		sorting: {
	// 			enabled: true,
	// 		},
	// 	},
	// 	{
	// 		header: 'Job',
	// 		field: 'job',
	// 	},
	// 	{
	// 		header: 'Age',
	// 		field: 'age',
	// 		align: GuiColumnAlign.RIGHT,
	// 	},
	// ];

	source = [
		{
			name: 'Brad 2',
			job: 'programmer',
			age: '40',
		},
		{
			name: 'John',
			job: 'athlete',
			age: '22',
		},
		{
			name: 'Eve',
			job: 'artist',
			age: '25',
		},
	];
}
