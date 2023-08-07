//tslint:disable:no-unsafe-any
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import {
	IDocTypeStandardFields,
	IDocumentAssetDto,
	IDocumentDto, IDocumentMainData,
	AssetDocumentType,
	standardDocTypesByID,
} from '@sneat/dto';
import { AddAssetBaseComponent, AssetService, ICreateAssetRequest } from '@sneat/extensions/assetus/components';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ContactService, contactContextFromBrief } from '@sneat/team/contacts/services';
import {
	IAssetContext, IContactContext,
	IContactusTeamDtoWithID,
	ITeamContext,
	zipMapBriefsWithIDs,
} from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-new-document',
	templateUrl: './new-document-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewDocumentPageComponent extends AddAssetBaseComponent implements OnChanges {

	@Input() public override team?: ITeamContext;
	@Input() public override contactusTeam?: IContactusTeamDtoWithID;

	belongsTo: 'member' | 'commune' = 'commune';

	public contact?: IContactContext;

	public isMissingRequiredParams = false;

	public readonly docTypes: ISelectItem[] = Object.values(standardDocTypesByID);

	public docTitle = '';
	public docType: AssetDocumentType = 'unspecified';
	public docFields: IDocTypeStandardFields = {};
	public docNumber = '';

	private readonly memberChanged = new Subject<void>();

	public members?: readonly IContactContext[];

	public selectedMembers?: readonly IContactContext[];

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		assetService: AssetService,
		private readonly contactService: ContactService,
		private readonly teamNavService: TeamNavService,
	) {
		super('NewDocumentPageComponent', route, params, assetService);
		this.trackUrl();
	}

	onDocTypeChange(docType: AssetDocumentType): void {
		this.docFields = standardDocTypesByID[docType].fields || {};
	}

	private trackUrl(): void {
		this.trackUrlMemberID();
		this.trackUrlDocType();
	}

	public get isFormValid(): boolean {
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
			const team = this.team;
			if (team) {
				const contactusTeam = this.contactusTeam;
				this.members = zipMapBriefsWithIDs(contactusTeam?.dto?.contacts)
					.map(contact => contactContextFromBrief(contact, team));
			}
		}
	}

	private trackUrlMemberID(): void {
		this.route.queryParams.pipe(
			takeUntil(this.destroyed),
			map(qp => qp['contact'] as string),
			distinctUntilChanged(),
		).subscribe({
			next: this.watchContact,
		});
	}

	private trackUrlDocType(): void {
		this.route.queryParams.pipe(
			takeUntil(this.destroyed),
			map(qp => qp['type'] as string),
			distinctUntilChanged(),
		).subscribe(docType => {
			this.docType = docType as AssetDocumentType;
		});
	}

	private watchContact = (contactID: string): void => {
		this.memberChanged.next();
		const team = this.team;
		if (!team) {
			return;
		}
		this.contact = { id: contactID, team };
		this.contactService.watchContactById(team, contactID)
			.subscribe({
					next: member => {
						this.contact = member;
					},
					error: this.errorLogger.logErrorHandler('failed in watching member'),
				},
			);
	};

	public submit(): void {
		if (!this.team) {
			return;
		}
		const dto: IDocumentDto = {
			title: this.docTitle,
			type: this.docType,
			number: this.docNumber,
			memberIDs: this.contact?.id ? [this.contact.id] : undefined,
		};
		const request: ICreateAssetRequest<IDocumentMainData> = {
			teamID: this.team.id,
			memberID: this?.contact?.id,
			dto,
		} as unknown as ICreateAssetRequest<IDocumentMainData>;


		this.assetService.createAsset<IDocumentMainData, IDocumentAssetDto>(this.team, request)
			.subscribe({
				next: this.onDocCreated,
				error: (err: unknown) => {
					this.errorLogger.logError(err, 'Failed to create new document');
				},
			});
	}

	private onDocCreated = (doc: IAssetContext<IDocumentAssetDto>): void => {
		const team = this.team;
		if (!team) {
			return;
		}
		this.teamNavService
			.navigateForwardToTeamPage(team, 'document/' + doc.id)
			.catch(this.errorLogger.logErrorHandler('Failed to navigate to document page'));
	};
}
