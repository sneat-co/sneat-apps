import {Component, ComponentFactoryResolver, Injector, Type} from '@angular/core';
import { ɵcreateInjector as createInjector } from '@angular/core';
import {AppComponentService} from '@sneat/app';
import {FirebaseApp} from "@angular/fire/compat";

@Component({
	selector: 'datatug-root',
	templateUrl: 'datatug-app.component.html',
})
export class DatatugAppComponent {

	menu: Promise<Type<any>>;
	menuInjector: Injector;

	constructor(
		private readonly injector: Injector,
		readonly appComponentService: AppComponentService,
		private componentFactoryResolver: ComponentFactoryResolver,
		app: FirebaseApp,
	) {
		appComponentService.initializeApp();
		this.loadMenu();
	}

	loadMenu(): void {
		if (!this.menu) {
			this.menu = import(`@sneat/datatug/menu`)
				.then(({DatatugMenuModule, DatatugMenuComponent}) => {
					const factory = this.componentFactoryResolver.resolveComponentFactory(DatatugMenuComponent);
					this.menuInjector = createInjector(DatatugMenuModule, this.injector);
					return DatatugMenuComponent;
				});
		}
	}
}
