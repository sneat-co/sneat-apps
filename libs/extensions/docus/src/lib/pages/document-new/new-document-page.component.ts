import {
  Component,
  computed,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ContactsSelectorInputComponent } from '@sneat/extension-contactus-shared';
import { ClassName, ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { CountrySelectorComponent } from '@sneat/components';
import {
  addSpace,
  IContactContext,
  IContactusSpaceDboAndID,
  IContactWithBrief,
  IContactWithBriefAndSpace,
} from '@sneat/extension-contactus-contract';
import {
  IDocTypeStandardFields,
  AssetDocumentType,
  standardDocTypesByID,
  IAssetDocumentExtra,
  AddAssetBaseComponent,
  AssetusCoreServicesModule,
  ICreateAssetRequest,
  IAssetResponse,
} from '@sneat/extension-assetus';
import { docTypeListItems } from '../documents/doc-type-presentation';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import {
  ContactService,
  ContactusServicesModule,
} from '@sneat/extension-contactus-internal';
import { zipMapBriefsWithIDs } from '@sneat/space-models';
import { SpaceNavService, SpaceServiceModule } from '@sneat/space-services';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

@Component({
  imports: [
    FormsModule,
    CountrySelectorComponent,
    SpaceServiceModule,
    SelectFromListComponent,
    AssetusCoreServicesModule,
    ContactusServicesModule,
    ContactsSelectorInputComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonText,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonItemDivider,
    IonGrid,
    IonRow,
    IonCol,
    IonCheckbox,
    IonCardContent,
    IonButton,
    RouterLink,
  ],
  providers: [
    SpaceComponentBaseParams,
    { provide: ClassName, useValue: 'NewDocumentPageComponent' },
  ],
  selector: 'sneat-new-document',
  templateUrl: './new-document-page.component.html',
})
export class NewDocumentPageComponent
  extends AddAssetBaseComponent
  implements OnChanges
{
  private readonly contactService = inject(ContactService);
  private readonly spaceNavService = inject(SpaceNavService);

  // @Input() public override space?: ISpaceContext;
  // contactusSpace and country were inherited from the legacy AddAssetBaseComponent;
  // the new @sneat/extension-assetus base no longer declares them, so they are
  // now owned locally (same fields, same behaviour).
  @Input() public contactusSpace?: IContactusSpaceDboAndID;
  protected country?: string;

  protected contact?: IContactContext;

  protected isMissingRequiredParams = false;

  protected readonly docTypes: ISelectItem[] = [...docTypeListItems];

  protected docTitle = '';
  // Unset until the user picks a type. The legacy lib modelled "no type chosen"
  // as the 'unspecified' member of AssetDocumentType, which the live
  // @sneat/extension-assetus no longer defines; undefined carries the same
  // "not yet selected" meaning the template guards rely on.
  protected docType?: AssetDocumentType | 'other';
  protected docFields: IDocTypeStandardFields = {};
  protected docNumber = '';

  private readonly memberChanged = new Subject<void>();

  protected readonly $contacts = signal<
    readonly IContactWithBrief[] | undefined
  >(undefined);

  protected readonly $selectedContacts = signal<
    readonly IContactWithBriefAndSpace[]
  >([]);

  protected readonly $hasSelectedContacts = computed<boolean>(
    () => !!this.$selectedContacts().length,
  );

  public constructor() {
    super();
    this.trackUrl();
  }

  onDocTypeChange(docType: AssetDocumentType | 'other'): void {
    this.docFields = standardDocTypesByID[docType].fields || {};
  }

  private trackUrl(): void {
    this.trackUrlMemberID();
    this.trackUrlDocType();
  }

  protected get isFormValid(): boolean {
    if (!this.docType) {
      return false;
    }
    const fields = standardDocTypesByID[this.docType].fields;
    this.docFields = fields || {};
    if (!fields) {
      return false;
    }
    if (fields?.title?.required && !this.docTitle.trim()) {
      return false;
    }
    if (fields?.number?.required && !this.docNumber.trim()) {
      return false;
    }
    // if (fields.validTill?.required && !this.docNumber.trim()) {
    // 	return false;
    // }
    return true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactusTeam']) {
      const space = this.space;
      if (space) {
        const contactusTeam = this.contactusSpace;
        this.$contacts.set(
          zipMapBriefsWithIDs(contactusTeam?.dbo?.contacts).map(
            addSpace(space),
          ),
        );
      }
    }
  }

  private trackUrlMemberID(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        map((qp) => qp['contact'] as string),
        distinctUntilChanged(),
      )
      .subscribe({
        next: this.watchContact,
      });
  }

  private trackUrlDocType(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        map((qp) => qp['type'] as string),
        distinctUntilChanged(),
      )
      .subscribe((docType) => {
        this.docType = docType as AssetDocumentType | 'other';
      });
  }

  private watchContact = (contactID: string): void => {
    this.memberChanged.next();
    const space = this.space;
    if (!space) {
      return;
    }
    this.contact = { id: contactID, space };
    this.contactService.watchContactById(space, contactID).subscribe({
      next: (member) => {
        this.contact = member;
      },
      error: this.errorLogger.logErrorHandler('failed in watching member'),
    });
  };

  protected submit(): void {
    if (!this.space) {
      return;
    }
    const extra: IAssetDocumentExtra = {
      number: this.docNumber,
    };
    const request: ICreateAssetRequest = {
      spaceID: this.space.id,
      name: this.docTitle,
      category: 'document',
      condition: 'good',
      status: 'draft',
      possession: 'owning',
      type: this.docType,
      memberIDs: this.contact?.id ? [this.contact.id] : undefined,
      extraType: 'document',
      extra: extra as Record<string, unknown>,
    };

    this.assetService.createAsset(request).subscribe({
      next: this.onDocCreated,
      error: (err: unknown) => {
        this.errorLogger.logError(err, 'Failed to create new document');
      },
    });
  }

  private onDocCreated = (resp: IAssetResponse): void => {
    const space = this.space;
    if (!space) {
      return;
    }
    this.spaceNavService
      .navigateForwardToSpacePage(space, 'document/' + resp.id)
      .catch(
        this.errorLogger.logErrorHandler('Failed to navigate to document page'),
      );
  };
}
