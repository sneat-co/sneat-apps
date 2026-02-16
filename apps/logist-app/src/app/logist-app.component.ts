import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenu,
  IonRouterOutlet,
  IonSplitPane,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SneatBaseAppComponent } from '@sneat/app';
import { TopMenuService } from '@sneat/core';

@Component({
  selector: 'sneat-root',
  templateUrl: './logist-app.component.html',
  imports: [
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonText,
    IonContent,
    IonRouterOutlet,
  ],
})
export class LogistAppComponent
  extends SneatBaseAppComponent
  implements AfterViewInit
{
  @ViewChild('ionSplitPane') ionSplitPane!: IonSplitPane;

  constructor() {
    const topMenuService = inject(TopMenuService);

    super(topMenuService);
    // window.addEventListener('hashchange', (event: HashChangeEvent) => {
    // 	// Log the state data to the console
    // 	console.log('hashchange', event.newURL);
    // 	this.ionSplitPane.disabled = location.hash === '#print';
    // });
  }

  ngAfterViewInit(): void /* Intentionally not ngOnInit */ {
    if (this.ionSplitPane) {
      if (location.hash === '#print') {
        this.ionSplitPane.disabled = true;
      }
    }
  }
}
