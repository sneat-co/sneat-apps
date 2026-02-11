import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import {
  allUserStoresAsFlatList,
  DatatugProjStoreType,
  IDatatugStoreBriefWithId,
} from '../../../models/interfaces';
import {
  AgentStateService,
  IAgentState,
} from '../../../services/repo/agent-state.service';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';
import { NavController } from '@ionic/angular/standalone';
import { DatatugUserService } from '../../../services/base/datatug-user-service';
import { AuthStatus } from '@sneat/auth-core';
import { IDatatugStoreContext } from '../../../nav/nav-models';
import { parseStoreRef } from '@sneat/core';
import { LoadingItemsComponent } from '../loading-items-component';

@Component({
  selector: 'sneat-datatug-my-stores',
  templateUrl: './my-stores.component.html',
  imports: [
    LoadingItemsComponent,
    IonCard,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonBadge,
    IonText,
  ],
})
export class MyStoresComponent implements OnInit, OnDestroy {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly navController = inject(NavController);
  readonly agentStateService = inject(AgentStateService);
  private readonly datatugNavService = inject(DatatugNavService);
  private readonly datatugUserService = inject(DatatugUserService);

  public authStatus?: AuthStatus;
  public userRecordLoaded = false;

  public stores?: IDatatugStoreBriefWithId[];

  public agentState?: IAgentState;

  private readonly destroyed = new Subject<void>();

  ngOnInit(): void {
    this.agentStateService
      .getAgentInfo('localhost:8989')
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (agentState) => {
          console.log('MyStoresComponent => agent state:', agentState);
          this.agentState = agentState;
        },
        error: this.errorLogger.logErrorHandler('failed to get agent state'),
      });
    this.datatugUserService.datatugUserState
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (datatugUserState) => {
          // console.log('MyStoresComponent => datatugUserState:', datatugUserState);
          this.authStatus = datatugUserState?.status;
          this.userRecordLoaded =
            !!datatugUserState?.record || datatugUserState.record === null;
          const { record } = datatugUserState;
          if (record || record == null) {
            this.stores = allUserStoresAsFlatList(record?.datatug?.stores);
          }
        },
        error: this.errorLogger.logErrorHandler(
          'Failed to get datatug user state',
        ),
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  storeIcon(storeType: DatatugProjStoreType): string {
    switch (storeType) {
      case 'firestore':
        return 'boat-outline';
      case 'github':
        return 'logo-github';
      default:
        return 'terminal-outline';
    }
  }

  goStore(brief: IDatatugStoreBriefWithId): void {
    if (!brief.projects) {
      brief = { ...brief, projects: {} }; // TODO: document why we do this or remove
    }
    const store: IDatatugStoreContext = {
      ref: parseStoreRef(brief.id),
      brief,
    };
    this.datatugNavService.goStore(store);
  }

  public checkAgent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  public openHelp(
    event: Event,
    path: 'agent' | 'cloud' | 'github.com' | 'private-repos',
  ): void {
    event.preventDefault();
    event.stopPropagation();
    window.open('https://datatug.app/' + path, '_blank');
  }
}
