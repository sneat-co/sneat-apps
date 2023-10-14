import { TopMenuService } from '@sneat/core';

export class SneatBaseAppComponent {
	// Sets `ion-split-pane[ionSplitPaneVisible]`
	public readonly visibilityChanged: (event: Event) => void;

	constructor(topMenuService: TopMenuService) {
		this.visibilityChanged = topMenuService.visibilityChanged;
	}
}
