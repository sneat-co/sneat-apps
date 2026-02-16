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
import { IMemberContext } from '@sneat/contactus-core';
import { ContactusServicesModule } from '@sneat/contactus-services';
import {
  AssetService,
  AssetusServicesModule,
} from '@sneat/ext-assetus-components';
import {
  SpaceComponentBaseParams,
  SpaceItemsBaseComponent,
  SpacePageTitleComponent,
} from '@sneat/space-components';
import {
  IAssetContext,
  IAssetDocumentContext,
  IAssetDocumentExtra,
} from '@sneat/mod-assetus-core';
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
    AssetusServicesModule,
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
    this.documents = window.history.state?.documents as IAssetContext<
      'document',
      IAssetDocumentExtra
    >[];
  }

  protected override onSpaceIdChanged() {
    super.onSpaceIdChanged();
    this.loadDocuments();
  }

  loadDocuments() {
// console.log('DocumentsPage.loadDocuments()');
    if (this.space?.id) {
      this.assetService
        .watchSpaceAssets<'document', IAssetDocumentExtra>(this.space)
        .pipe(this.takeUntilDestroyed())
        .subscribe({
          next: (documents) => {
            this.documents = documents;
          },
        });
    }
  }

  public goType(type: string) {
// console.log(`goType(${type})`);
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
