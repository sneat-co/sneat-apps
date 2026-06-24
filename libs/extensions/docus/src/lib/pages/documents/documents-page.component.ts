import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FilterItemComponent } from '@sneat/components';
import { IMemberContext } from '@sneat/extension-contactus-contract';
import { ContactusServicesModule } from '@sneat/extension-contactus-internal';
import {
  AssetService,
  AssetusCoreServicesModule,
} from '@sneat/extension-assetus-internal';
import { IAssetDocumentContext } from '@sneat/extension-assetus-contract';
import {
  SpaceComponentBaseParams,
  SpaceItemsBaseComponent,
  SpacePageTitleComponent,
} from '@sneat/space-components';
import { map } from 'rxjs';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { DocumentsByTypeComponent } from './components/documents-by-type/documents-by-type.component';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';

@Component({
  selector: 'sneat-documents-page',
  templateUrl: './documents-page.component.html',
  imports: [
    DocumentsListComponent,
    FilterItemComponent,
    DocumentsByTypeComponent,
    FormsModule,
    SpacePageTitleComponent,
    ContactusServicesModule,
    AssetusCoreServicesModule,
    SpaceServiceModule,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonMenuButton,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonCard,
    IonFooter,
  ],
  providers: [
    { provide: ClassName, useValue: 'DocumentsPageComponent' },
    SpaceComponentBaseParams,
  ],
})
export class DocumentsPageComponent extends SpaceItemsBaseComponent {
  private assetService = inject(AssetService);

  public segment: 'type' | 'owner' | 'list' = 'type';

  public documents: IAssetDocumentContext[];
  public rootDocs?: IAssetDocumentContext[];

  protected $filter = signal<string>('');

  constructor() {
    super('');
    this.documents = window.history.state?.documents as IAssetDocumentContext[];
  }

  protected override onSpaceIdChanged() {
    super.onSpaceIdChanged();
    this.loadDocuments();
  }

  loadDocuments() {
    const space = this.space;
    if (space?.id) {
      // The live AssetService exposes watchAssets(spaceID) (all assets in the
      // space). Filter to the document category and wrap each as an
      // IAssetDocumentContext, preserving the legacy watchSpaceAssets('document')
      // behaviour.
      this.assetService
        .watchAssets(space.id)
        .pipe(
          map((assets) =>
            assets
              .filter((a) => a.dbo.category === 'document')
              .map(
                (a): IAssetDocumentContext => ({
                  id: a.id,
                  space,
                  dbo: a.dbo,
                }),
              ),
          ),
          this.takeUntilDestroyed(),
        )
        .subscribe({
          next: (documents) => {
            this.documents = documents;
          },
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public goType(_type: string) {
    // TODO: Implement navigation to document type
  }

  public goDoc(doc: IAssetDocumentContext) {
    if (!this.space) {
      this.errorLogger.logError(
        'not able to navigate to document without team context',
      );
      return;
    }
    this.spaceParams.spaceNavService
      .navigateForwardToSpacePage(this.space, `document/${doc.id}`, {
        state: { doc },
      })
      .catch(this.errorLogger.logError);
  }

  goNewDoc = (type?: string, member?: IMemberContext) => {
    const queryParams: { type?: string; member?: string } = type
      ? { type }
      : {};
    if (member) {
      queryParams['member'] = member.id;
    }
    // const state = member ? { member } : undefined;
    const space = this.space;
    if (space) {
      this.spaceNav
        .navigateForwardToSpacePage(space, 'new-document', {
          state: { docType: type },
        })
        .catch(
          this.errorLogger.logErrorHandler(
            'Failed to navigate to new doc page',
          ),
        );
    }
  };

  applyFilter(filter: string) {
    filter = filter && filter.toLowerCase();
    this.$filter.set(filter);
    // this.contacts = !filter && !role
    //     ? this.allContacts
    //     : this.allContacts.filter(c =>
    //         (!filter || c.title.toLowerCase().includes(filter))
    //         && (!role || c.roles && c.roles.includes(role))
    //     );
  }
}
