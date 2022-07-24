import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonSplitPane } from '@ionic/angular';
import { SneatBaseAppComponent } from '@sneat/app';
import { TopMenuService } from '@sneat/core';

@Component({
	selector: 'sneat-root',
	templateUrl: './freights-app.component.html',
	styleUrls: ['./freights-app.component.scss'],
})
export class FreightsAppComponent extends SneatBaseAppComponent implements AfterViewInit {

	@ViewChild('ionSplitPane') ionSplitPane!: IonSplitPane;

	constructor(
		topMenuService: TopMenuService,
	) {
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
