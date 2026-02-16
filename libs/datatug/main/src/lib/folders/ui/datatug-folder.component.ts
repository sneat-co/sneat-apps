import { TitleCasePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonText,
} from '@ionic/angular/standalone';
import { SneatCardListComponent } from '@sneat/components';
import { Observable, Subject, throwError } from 'rxjs';
import { IProjectRef } from '../../core/project-context';
import { takeUntil, tap } from 'rxjs/operators';
import { folderItemsAsList, IFolder } from '../../models/definition/folder';
import { IOptionallyTitled } from '../../models/core';
import {
  IProjItemBrief,
  ProjectItem,
  ProjectItemType,
} from '../../models/definition/project';
import { CreateNamedRequest } from '../../dto/requests';
import { IRecord } from '@sneat/data';
import { DatatugNavService } from '../../services/nav/datatug-nav.service';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { EntityService } from '../../services/unsorted/entity.service';
import { EnvironmentService } from '../../services/unsorted/environment.service';
import { SchemaService } from '../../services/unsorted/schema.service';
import { DatatugFoldersService } from '../core/datatug-folders.service';
import { DatatugBoardService } from '../../board/core/datatug-board.service';

@Component({
  selector: 'sneat-datatug-folder',
  templateUrl: 'datatug-folder.component.html',
  imports: [
    TitleCasePipe,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge,
    IonText,
    IonCard,
    IonCardContent,
    SneatCardListComponent,
    FormsModule,
  ],
})
export class DatatugFolderComponent implements OnChanges, OnDestroy {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly foldersService = inject(DatatugFoldersService);
  private readonly datatugNavService = inject(DatatugNavService);
  private readonly schemaService = inject(SchemaService);
  private readonly environmentService = inject(EnvironmentService);
  private readonly boardService = inject(DatatugBoardService);
  private readonly entityService = inject(EntityService);

  readonly Environment: ProjectItemType = ProjectItem.environment as const;

  readonly Board: ProjectItemType = ProjectItem.Board;
  readonly Query: ProjectItemType = ProjectItem.query;

  tabs = ['boards', 'queries', 'environments', 'entities'];

  private destroyed = new Subject<void>();

  boards?: IProjItemBrief[];
  queries?: IProjItemBrief[];

  @Input() path = '~';
  @Input() projectRef?: IProjectRef;

  tab: 'boards' | 'queries' | 'environments' | 'entities' = 'boards';

  public folder?: IFolder | null;

  public numberOf(tab: string): number {
    return (this.folder?.numberOf && this.numberOf(tab)) || 0;
  }

  public getItemLink = (path: string) => (item: IProjItemBrief) =>
    `${path}/${item.id}`;

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectRef']) {
      if (this.projectRef) {
        this.subscribeForFolder();
      }
    }
  }

  public createFolderItem: (
    name: string,
  ) => Observable<IRecord<IOptionallyTitled>> = (title: string) =>
    this.createProjItem(
      ProjectItem.Board,
      title,
      this.boardService.createNewBoard,
    );

  public createQuery = (title: string) =>
    alert(`Not implemented yet. ${title}`);

  public createEnvironment = (title: string) =>
    this.createProjItem(
      ProjectItem.environment,
      title,
      this.environmentService.createEnvironment,
    );

  public createSchema = (title: string) =>
    this.createProjItem(
      ProjectItem.dbModel,
      title,
      this.schemaService.createSchema,
    );

  private createProjItem<T extends IOptionallyTitled>(
    projItemType: ProjectItem,
    name: string,
    create: (request: CreateNamedRequest) => Observable<IRecord<T>>,
  ): Observable<IRecord<T>> {
    // console.log('createProjItem()', projItemType, name);
    if (!this.projectRef) {
      return throwError(() => 'projectRef is not set');
    }
    return create({ projectRef: this.projectRef, name: name.trim() }).pipe(
      tap((value) => {
        // console.log('project item created:', value);
        try {
          // if (!this.project.summary.environments) {
          // 	this.project = {
          // 		...this.project,
          // 		summary: {...this.project.summary, environments: []},
          // 	}
          // }
          const projItemBrief = { id: value.id, title: value.dbo?.title };
          // this.project.environments.push(projItemBrief)
          this.goProjItemPage(projItemType, projItemBrief);
        } catch (err) {
          this.errorLogger.logError(err, 'Failed to process API response');
        }
      }),
      // catchError(err => {
      // 	this.errorLogger.logError(err, 'Failed to create ' + projItemType);
      // 	return throwError(err);
      // }),
    );
  }

  private goProjItemPage(
    page: ProjectItemType,
    _: IProjItemBrief,
  ): void {
    // console.log('goProjItemPage()', page, projItem, this.projectRef);
    if (!this.projectRef) {
      throw new Error('projectRef is not set');
    }
    switch (page) {
      case ProjectItem.environment:
        page = 'env' as ProjectItemType;
        break;
    }
    this.datatugNavService.goProjPage(
      page,
      { ref: this.projectRef },
      {
        projectContext: { ref: this.projectRef },
      },
    );
  }

  private subscribeForFolder(): void {
    if (this.projectRef) {
      this.foldersService
        .watchFolder({ ...this.projectRef, id: this.path })
        .pipe(takeUntil(this.destroyed))
        .subscribe({
          next: (folder) => {
            this.folder = folder;
            this.boards = folder?.boards
              ? folderItemsAsList(folder.boards).map((v) => ({
                  id: v.id,
                  title: v.name,
                }))
              : [];
            // console.log('DatatugFolderComponent => folder:', folder);
          },
        });
    }
  }
}
