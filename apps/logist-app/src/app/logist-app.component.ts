import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonSplitPane } from '@ionic/angular';
import { SneatBaseAppComponent } from '@sneat/app';
import { TopMenuService } from '@sneat/core';
import { gitHash } from '@sneat/components';

@Component({
	selector: 'sneat-root',
	templateUrl: './logist-app.component.html',
})
export class LogistAppComponent
	extends SneatBaseAppComponent
	implements AfterViewInit
{
	@ViewChild('ionSplitPane') ionSplitPane!: IonSplitPane;

	getGitHash(): string {
		return gitHash;
	}
	constructor(topMenuService: TopMenuService) {
		super(topMenuService);
		// window.addEventListener('hashchange', (event: HashChangeEvent) => {
		// 	// Log the state data to the console
		// 	console.log('hashchange', event.newURL);
		// 	this.ionSplitPane.disabled = location.hash === '#print';
		// });
	}

	ngAfterViewInit(): void {
		if (this.ionSplitPane) {
			this.ionSplitPane.disabled = location.hash === '#print';
		}
	}
}
