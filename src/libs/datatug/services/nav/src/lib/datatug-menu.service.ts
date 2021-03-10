import {Injectable, TemplateRef} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DatatugMenuService {
	private readonly contextMenu$ = new BehaviorSubject<TemplateRef<any> | undefined>(undefined);
	public readonly contextMenu = this.contextMenu$.asObservable();

	constructor() {
		console.log('DatatugMenuService.constructor()');
	}

	setContextMenu(templateRef: TemplateRef<any>): void {
		console.log('DatatugMenuService.setContextMenu()', templateRef);
		this.contextMenu$.next(templateRef);
	}

	removeContextMenu(templateRef: TemplateRef<any>): void {
		if (this.contextMenu$.value === templateRef) {
			this.contextMenu$.next(undefined)
		}
	}
}
