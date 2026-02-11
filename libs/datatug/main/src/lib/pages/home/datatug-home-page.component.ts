import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CopyrightComponent } from '@sneat/components';
import { DatatugServicesStoreModule } from '../../services/repo/datatug-services-store.module';
import { WormholeModule } from '@sneat/wormhole';
import { MyDatatugProjectsComponent } from './my-projects/my-datatug-projects.component';
import { MyStoresComponent } from './my-stores/my-stores.component';
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
  imports: [
    FormsModule,
    // CoreModule,
    WormholeModule,
    DatatugServicesStoreModule,
    // NewProjectFormComponent,
    // GuiGridModule,
    CopyrightComponent,
    MyDatatugProjectsComponent,
    MyStoresComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButtons,
    IonButton,
    IonIcon,
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
