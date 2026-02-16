import { Component, OnDestroy, inject } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AuthStatus,
  AuthStatuses,
  ISneatAuthState,
  SneatAuthStateService,
} from '@sneat/auth-core';
import { IEnvDbTableContext, IProjectContext } from '../nav/nav-models';
import {
  DatatugUserService,
  IDatatugUserState,
} from '../services/base/datatug-user-service';
import { DatatugNavContextService } from '../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../services/nav/datatug-nav.service';

@Component({
  selector: 'sneat-datatug-menu',
  templateUrl: './datatug-menu.component.html',
  styleUrls: ['./datatug-menu.component.scss'],
})
export class DatatugMenuComponent implements OnDestroy {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly sneatAuthStateService = inject(SneatAuthStateService);
  private readonly datatugNavContextService = inject(DatatugNavContextService);
  private readonly nav = inject(DatatugNavService);
  private readonly datatugUserService = inject(DatatugUserService);

  public authStatus?: AuthStatus;
  public currentStoreId?: string;
  public currentProject?: IProjectContext;

  public table?: IEnvDbTableContext;
  public currentFolder?: Observable<string>;
  public authState: ISneatAuthState = { status: AuthStatuses.authenticating };
  private readonly destroyed = new Subject<void>();

  public datatugUserState?: IDatatugUserState;

  constructor() {
    const errorLogger = this.errorLogger;
    const datatugNavContextService = this.datatugNavContextService;

    // console.log('DatatugMenuComponent.constructor()');
    this.sneatAuthStateService.authState
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (authState) => {
          this.authState = authState;
        },
        error: errorLogger.logErrorHandler(
          'failed to process sneat auth state',
        ),
      });

    // userService.userRecord.subscribe(user => {
    // 	this.projects = user?.data?.dataTugProjects;
    // });
    try {
      this.trackAuthState();
      this.trackCurrentUser();
      this.currentFolder = datatugNavContextService?.currentFolder;
      if (datatugNavContextService) {
        this.trackCurrentStore();
        this.trackCurrentProject();
        this.trackCurrentEnvDbTable();
      } else {
        console.error('datatugNavContextService is not injected');
      }
    } catch (e) {
      errorLogger.logError(e, 'Failed to setup context tracking');
    }
  }

  // public get currentProjUrlId(): string | undefined {
  // 	return projectRefToString(this.currentProject?.ref);
  // }

  private trackAuthState(): void {
    if (!this.sneatAuthStateService) {
      console.error('this.sneatAuthStateService is not injected');
      return;
    }
    this.sneatAuthStateService.authStatus
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (authState) => (this.authStatus = authState),
        error: this.errorLogger.logErrorHandler('failed to get auth stage'),
      });
  }

  ngOnDestroy(): void {
    if (this.destroyed) {
      this.destroyed.next();
      this.destroyed.complete();
    }
  }

  private trackCurrentUser(): void {
    try {
      if (!this.datatugUserService) {
        console.error('this.datatugUserService is not injected');
        return;
      }
      this.datatugUserService.datatugUserState
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: (datatugUser) => {
            this.datatugUserState = datatugUser;
            // console.log('trackCurrentUser() => datatugUser:', datatugUser);
          },
          error: this.errorLogger.logErrorHandler(
            'Failed to get user record for menu',
          ),
        });
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to setup tracking of current user');
    }
  }

  private trackCurrentStore(): void {
    try {
      this.datatugNavContextService.currentStoreId
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: this.onCurrentStoreChanged,
          error: (err) =>
            this.errorLogger.logError(err, 'Failed to get storeId'),
        });
    } catch (e) {
      this.errorLogger.logError(
        e,
        'Failed to setup tracking of current repository',
      );
    }
  }

  private readonly onCurrentStoreChanged = (storeId?: string): void => {
    if (storeId === this.currentStoreId) {
      return;
    }
      'DatatugMenuComponent => storeId changed:',
      storeId,
      this.currentStoreId,
    );
    this.currentStoreId = storeId;
  };

  private trackCurrentProject(): void {
    try {
      this.datatugNavContextService.currentProject
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: this.onProjectChanged,
          error: (err) =>
            this.errorLogger.logError(err, 'Failed to get current project'),
        });
    } catch (e) {
      this.errorLogger.logError(
        e,
        'Failed to setup tracking of current project',
      );
    }
  }

  onProjectChanged = (project?: IProjectContext) => {
    this.currentProject = project;
  };

  private trackCurrentEnvDbTable(): void {
    this.datatugNavContextService.currentEnvDbTable
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (table) => {
          if (table) {
            if (
              table.name !== this.table?.name &&
              table.schema !== this.table?.schema
            ) {
                `DatatugMenuComponent => currentTable changed to: ${table.schema}.${table.name}, meta:`,
                table.meta,
              );
            }
          }
          this.table = table;
        },
        error: (err) =>
          this.errorLogger.logError(err, 'Failed to get current table context'),
      });
  }
}
