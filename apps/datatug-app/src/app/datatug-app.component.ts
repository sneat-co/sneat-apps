import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component, Injector, Type } from '@angular/core';
import {
	IonApp,
	IonContent,
	IonHeader,
	IonMenu,
	IonRouterOutlet,
	IonSplitPane,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { WormholeModule } from '@sneat/wormhole';

@Component({
	selector: 'sneat-datatug-root',
	templateUrl: 'datatug-app.component.html',
	imports: [
		IonApp,
		IonSplitPane,
		IonMenu,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		NgComponentOutlet,
		IonRouterOutlet,
		AsyncPipe,
		WormholeModule,
	],
})
export class DatatugAppComponent {
	menu?: Promise<Type<unknown>>;
	menuInjector?: Injector;

	// constructor(
	// 	private readonly injector: Injector,
	// 	// readonly appComponentService: AppComponentService,
	// 	private componentFactoryResolver: ComponentFactoryResolver,
	// ) {
	// 	// appComponentService.initializeApp();
	// 	// this.loadMenu();
	// }

	// loadMenu(): void {
	// 	if (!this.menu) {
	// 		this.menu = import(`@sneat/ext-datatug-menu`).then(
	// 			({ DatatugMenuModule, DatatugMenuComponent }) => {
	// 				const factory =
	// 					this.componentFactoryResolver.resolveComponentFactory(
	// 						DatatugMenuComponent,
	// 					);
	// 				this.menuInjector = createInjector(DatatugMenuModule, this.injector);
	// 				return DatatugMenuComponent;
	// 			},
	// 		);
	// 	}
	// }
}
