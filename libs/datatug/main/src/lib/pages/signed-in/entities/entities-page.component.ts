import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { WormholeModule } from '@sneat/wormhole';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  NavController,
  ToastController,
  ViewDidEnter,
  ViewDidLeave,
} from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { IEntity } from '../../../models/definition/metapedia/entity';
import { IProjEntity } from '../../../models/definition/project';
import { IProjectContext } from '../../../nav/nav-models';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';
import { EntityService } from '../../../services/unsorted/entity.service';

type Entities = IRecord<IEntity>[];

@Component({
  selector: 'sneat-datatug-entities',
  templateUrl: './entities-page.component.html',
  imports: [
    FormsModule,
    WormholeModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonLabel,
    IonContent,
    IonList,
    IonItem,
    IonBadge,
    IonCard,
    IonInput,
  ],
})
export class EntitiesPageComponent
  implements OnDestroy, ViewDidEnter, ViewDidLeave
{
  private readonly route = inject(ActivatedRoute);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private navCtrl = inject(NavController);
  private readonly datatugNavService = inject(DatatugNavService);
  private readonly navContextService = inject(DatatugNavContextService);
  private readonly entityService = inject(EntityService);
  private readonly toastCtrl = inject(ToastController);

  entities?: Entities;
  project?: IProjectContext;
  private readonly destroyed = new Subject<void>();

  constructor() {
    const navContextService = this.navContextService;

    navContextService.currentProject.pipe(takeUntil(this.destroyed)).subscribe({
      next: (currentProject) => {
        this.project = currentProject;
        this.loadEntities();
        // if (currentProject?.brief && !this.entities) {
        // 	if (currentProject?.summary?.entities) {
        // 		this.setEntities([
        // 			...currentProject.summary.entities.map(entity => ({
        // 				id: entity.id,
        // 				data: entity as IEntity,
        // 			}))
        // 		]);
        // 	}
        // 	// this.loadEntities();
        // }
      },
      error: (err) =>
        this.errorLogger.logError(err, 'Failed to get current project context'),
    });
  }

  protected isActiveView = false;

  ionViewDidEnter(): void {
    // console.log('ionViewDidEnter()');
    this.isActiveView = true;
  }

  ionViewDidLeave(): void {
    // console.log('ionViewDidLeave()');
    this.isActiveView = false;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  entityUrl(entity: IProjEntity): string {
    if (!this.project?.ref) {
      return undefined as unknown as string; // TODO: fix typing
    }
    return this.datatugNavService.projectPageUrl(
      this.project.ref,
      'entity',
      entity.id,
    );
  }

  goNewEntity(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.datatugNavService.goProjPage('new-entity', this.project);
  }

  goEntity(entity: IProjEntity): void {
    if (!this.project?.ref) {
      return;
    }
    this.datatugNavService.goEntity(this.project, entity);
  }

  deleteEntity(event: Event, entity: IProjEntity): void {
    event?.stopPropagation();
    event?.preventDefault();
    if (!this.project?.ref) {
      return;
    }
    this.entityService.deleteEntity(this.project.ref, entity.id).subscribe({
      next: async () => {
        this.entities = (this.entities as IProjEntity[]).filter(
          (v) => v.id !== entity.id,
        );
        const toast = await this.toastCtrl.create({
          position: 'top',
          header: 'Success',
          message: 'Entity deleted',
          duration: 2000,
          buttons: ['OK'],
        });
        await toast.present();
      },
      error: (err) => this.errorLogger.logError(err, 'Failed to delete entity'),
    });
  }

  private loadEntities(): void {
    if (!this.project) {
      return;
    }
    this.entityService
      .getAllEntities(this.project.ref)
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (entities) => this.setEntities(entities),
        error: (err) =>
          this.errorLogger.logError(err, 'Failed to load project entities'),
      });
  }

  private setEntities(entities: Entities): void {
    //console.log('entities', [...entities]);
    this.entities = entities.toSorted((a, b) => (a.id > b.id ? 1 : -1));
    //console.log('this.entities', this.entities);
  }
}
