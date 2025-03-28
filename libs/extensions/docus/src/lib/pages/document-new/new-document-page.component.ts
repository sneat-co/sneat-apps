import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { CountrySelectorComponent } from '@sneat/components';
import {
	IContactBrief,
	IContactContext,
	IContactusSpaceDboAndID,
} from '@sneat/contactus-core';
import { MembersSelectorModule } from '@sneat/contactus-shared';
import { IIdAndBrief } from '@sneat/core';
import {
	IDocTypeStandardFields,
	AssetDocumentType,
	standardDocTypesByID,
	IAssetDocumentExtra,
	IAssetDboBase,
	IAssetDocumentContext,
} from '@sneat/mod-assetus-core';
import {
	AddAssetBaseComponent,
	AssetusServicesModule,
	ICreateAssetRequest,
} from '@sneat/extensions-assetus-components';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import {
	ContactService,
	contactContextFromBrief,
	ContactusServicesModule,
} from '@sneat/contactus-services';
import { zipMapBriefsWithIDs } from '@sneat/space-models';
import { SpaceNavService, SpaceServiceModule } from '@sneat/space-services';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-new-document',
	templateUrl: './new-document-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		FormsModule,
		IonicModule,
		CountrySelectorComponent,
		SpaceServiceModule,
		SelectFromListComponent,
		MembersSelectorModule,
		AssetusServicesModule,
		ContactusServicesModule,
	],
})
export class NewDocumentPageComponent
	extends AddAssetBaseComponent
	implements OnChanges
{
	// @Input() public override space?: ISpaceContext;
	@Input() public override contactusSpace?: IContactusSpaceDboAndID;

	protected contact?: IContactContext;

	protected isMissingRequiredParams = false;

	protected readonly docTypes: ISelectItem[] =
		Object.values(standardDocTypesByID);

	protected docTitle = '';
	protected docType: AssetDocumentType = 'unspecified';
	protected docFields: IDocTypeStandardFields = {};
	protected docNumber = '';

	private readonly memberChanged = new Subject<void>();

	protected members?: readonly IIdAndBrief<IContactBrief>[];

	protected selectedMembers?: readonly IIdAndBrief<IContactBrief>[];

	constructor(
		private readonly contactService: ContactService,
		private readonly spaceNavService: SpaceNavService,
	) {
		super('NewDocumentPageComponent');
		this.trackUrl();
	}

	onDocTypeChange(docType: AssetDocumentType): void {
		this.docFields = standardDocTypesByID[docType].fields || {};
	}

	private trackUrl(): void {
		this.trackUrlMemberID();
		this.trackUrlDocType();
	}

	protected get isFormValid(): boolean {
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
				this.members = zipMapBriefsWithIDs(contactusTeam?.dbo?.contacts).map(
					(contact) => contactContextFromBrief(contact, space),
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
				this.docType = docType as AssetDocumentType;
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
		const dto: IAssetDboBase<'document', IAssetDocumentExtra> = {
			status: 'draft',
			category: 'document',
			possession: 'owning',
			createdAt: { seconds: 0, nanoseconds: 0 },
			createdBy: '-',
			updatedAt: { seconds: 0, nanoseconds: 0 },
			updatedBy: '-',
			title: this.docTitle,
			type: this.docType,
			memberIDs: this.contact?.id ? [this.contact.id] : undefined,
			extraType: 'document',
			extra: {
				number: this.docNumber,
			},
		};
		const request: ICreateAssetRequest<'document', IAssetDocumentExtra> = {
			spaceID: this.space.id,
			memberID: this?.contact?.id,
			asset: dto,
		};

		this.assetService
			.createAsset<'document', IAssetDocumentExtra>(this.space, request)
			.subscribe({
				next: this.onDocCreated,
				error: (err: unknown) => {
					this.errorLogger.logError(err, 'Failed to create new document');
				},
			});
	}

	private onDocCreated = (doc: IAssetDocumentContext): void => {
		const space = this.space;
		if (!space) {
			return;
		}
		this.spaceNavService
			.navigateForwardToSpacePage(space, 'document/' + doc.id)
			.catch(
				this.errorLogger.logErrorHandler('Failed to navigate to document page'),
			);
	};
}
