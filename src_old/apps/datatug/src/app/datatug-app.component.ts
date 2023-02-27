import { Component, ComponentFactoryResolver, Injector, Type, ɵcreateInjector as createInjector } from '@angular/core';
import { AppComponentService } from '@sneat/app';

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
	) {
		appComponentService.initializeApp();
		this.loadMenu();
	}

	loadMenu(): void {
		if (!this.menu) {
			this.menu = import(`@sneat/datatug/menu`).then(
				({ DatatugMenuModule, DatatugMenuComponent }) => {
					const factory =
						this.componentFactoryResolver.resolveComponentFactory(
							DatatugMenuComponent,
						);
					this.menuInjector = createInjector(DatatugMenuModule, this.injector);
					return DatatugMenuComponent;
				},
			);
		}
	}
}
