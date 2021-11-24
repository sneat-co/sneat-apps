import { Component } from '@angular/core';
// import {
// 	GuiColumn,
// 	GuiColumnAlign,
// 	GuiColumnMenu,
// 	GuiInfoPanel,
// 	GuiSearching,
// 	GuiSorting,
// } from '@generic-ui/ngx-grid';

@Component({
	selector: 'datatug-home',
	templateUrl: 'datatug-home-page.component.html',
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

	source: Array<any> = [
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
