import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  AlertController,
} from '@ionic/angular/standalone';
import { SneatCardListComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatatugFoldersService } from '../../../../folders/core/datatug-folders.service';
import {
  folderItemsAsList,
  IFolder,
} from '../../../../models/definition/folder';
import {
  IProjBoard,
  IProjItemBrief,
} from '../../../../models/definition/project';
import { IProjectContext } from '../../../../nav/nav-models';
import { DatatugNavContextService } from '../../../../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../../../../services/nav/datatug-nav.service';
import { DatatugBoardService } from '../../../core/datatug-board.service';

@Component({
  selector: 'sneat-datatug-boards',
  templateUrl: './boards-page.component.html',
  imports: [
    SneatCardListComponent,
    IonHeader,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonLabel,
    IonContent,
  ],
})
export class BoardsPageComponent implements OnInit, OnDestroy {
  private readonly datatugNavContextService = inject(DatatugNavContextService);
  private readonly datatugNavService = inject(DatatugNavService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly boardService = inject(DatatugBoardService);
  private readonly alertCtrl = inject(AlertController);
  private readonly foldersService = inject(DatatugFoldersService);

  tab = 'shared';
  noItemsText?: string;

  boards?: IProjBoard[];
  defaultHref?: string;
  project?: IProjectContext;

  folderPath = '~';

  private readonly destroyed = new Subject<void>();

  constructor() {
    this.tabChanged(this.tab);
    this.datatugNavContextService.currentProject
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (currentProject) => {
          try {
            this.setProject(currentProject);
            // this.project = currentProject;
            // this.boards = currentProject?.summary?.boards || [];
          } catch (e) {
            this.errorLogger.logError(
              e,
              'Failed to process current project in Boards page',
            );
          }
        },
        error: (err) =>
          this.errorLogger.logError(
            err,
            'Failed to get current project at Boards page',
          ),
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private setProject(project?: IProjectContext): void {
    const path = this.folderPath;
    if (
      project?.ref?.projectId &&
      project.ref.projectId !== this.project?.ref?.projectId
    ) {
      this.foldersService
        .watchFolder({ ...project.ref, id: path })
        .pipe(takeUntil(this.destroyed))
        .subscribe((folder) => this.onFolderReceived(path, folder));
    }
    this.project = project;
  }

  private onFolderReceived = (path: string, folder?: IFolder | null): void => {
// console.log('onFolderReceived', path, folder);
    if (this.folderPath !== path) {
      return;
    }
    this.boards = [];
    if (folder?.boards) {
      this.boards = folderItemsAsList(folder.boards);
    }
  };

  protected getLinkToBoard = (item: unknown) => {
    const projItemBrief = item as IProjItemBrief;
    return (
      (this.project &&
        this.datatugNavService.projectPageUrl(
          this.project.ref,
          'board',
          projItemBrief.id,
        )) ||
      ''
    );
  };

  ngOnInit() {
    this.defaultHref =
      location.pathname.split('/').slice(0, -1).join('/') + 's';
  }

  public goBoard(item: unknown): void {
    if (this.project) {
      this.datatugNavService.goBoard(this.project, <IProjItemBrief>item);
    }
  }

  async newBoard(): Promise<void> {
    const modal = await this.alertCtrl.create({
      message: 'New board',
      inputs: [
        {
          name: 'title',
          type: 'text',
          // handler: v => {
          // 	console.log('input handler:', v);
          // },
          placeholder: 'Name, should be unique',
        },
      ],
      buttons: [
        {
          role: 'cancel',
          text: 'Cancel',
          cssClass: 'ion-color-medium',
        },
        {
          text: 'Create',
          handler: (value) => {
// console.log('alert value:', value);
            // const store: IProjStoreRef = {
            // 	type: 'firestore',
            // };
            if (!this.project) {
              return;
            }
            this.boardService
              .createNewBoard({
                projectRef: this.project.ref,
                name: value.title as string,
              })
              .subscribe({
                next: (board) => {
// console.log('Board created:', board);
                  this.boards?.push(board);
                },
                error: this.logError(
                  () =>
                    `Failed to create a new board with title [${value.title}]`,
                ),
              });
          },
        },
      ],
    });
    await modal.present();
  }

  public tabChanged(tab: string): void {
    this.tab = tab;
    switch (tab) {
      case 'favorite':
        this.noItemsText = 'No favorite boards';
        break;
      case 'personal':
        this.noItemsText = 'No personal boards';
        break;
      case 'shared':
        this.noItemsText = 'No shared boards';
        break;
      default:
        this.noItemsText = 'No boards';
    }
  }

  private logError = (message: () => string) => (err: unknown) =>
    this.errorLogger.logError(err, message());
}
