import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TopMenuService {
	private $isTopMenuVisible = new BehaviorSubject<boolean>(false);
	private $isTopMenuHidden = new BehaviorSubject<boolean>(true);

	public readonly isTopMenuVisible = this.$isTopMenuVisible.asObservable();
	public readonly isTopMenuHidden = this.$isTopMenuHidden.asObservable();

	public readonly visibilityChanged = (event: Event): void => {
		const visible = !!(event as CustomEvent).detail['visible'];
		console.log('visibilityChanged', visible);
		this.$isTopMenuVisible.next(visible)
		this.$isTopMenuHidden.next(!visible)
	}
}
