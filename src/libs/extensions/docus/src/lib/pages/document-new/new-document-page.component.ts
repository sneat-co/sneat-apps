//tslint:disable:no-unsafe-any
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { IDocTypeStandardFields, IDocumentDto, SneatDocType, standardDocTypesByID } from '@sneat/dto';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IDocumentContext, IMemberContext } from '@sneat/team/models';
import { memberContextFromBrief, MemberService, TeamNavService } from '@sneat/team/services';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { DocumentService, ICreateDocumentRequest } from '../../services/document.service';

@Component({
	selector: 'sneat-new-document',
	templateUrl: './new-document-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewDocumentPageComponent extends TeamBaseComponent {

	belongsTo: 'member' | 'commune' = 'commune';

	public member?: IMemberContext;

	public isMissingRequiredParams = false;

	public readonly docTypes: ISelectItem[] = Object.values(standardDocTypesByID);

	public country = '';
	public docTitle = '';
	public docType: SneatDocType = 'unspecified';
	public docFields: IDocTypeStandardFields = {};
	public docNumber = '';

	private readonly memberChanged = new Subject<void>();

	public members?: IMemberContext[]

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private readonly membersService: MemberService,
		private readonly documentService: DocumentService,
		private readonly teamNavService: TeamNavService,
	) {
		super('documents', route, params);
		this.trackUrl();
	}

	onDocTypeChange(docType: SneatDocType): void {
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

	protected override onTeamDtoChanged() {
		super.onTeamDtoChanged();
		const team = this.team;
		this.members = this.team?.dto?.members?.map(m => memberContextFromBrief(m, team))
	}

	private trackUrlMemberID(): void {
		this.route.queryParams.pipe(
			takeUntil(this.destroyed),
			map(qp => qp['member'] as string),
			distinctUntilChanged(),
		).subscribe({
			next: this.watchMember,
		});
	}

	private trackUrlDocType(): void {
		this.route.queryParams.pipe(
			takeUntil(this.destroyed),
			map(qp => qp['type'] as string),
			distinctUntilChanged(),
		).subscribe(docType => {
			this.docType = docType as SneatDocType;
		});
	}

	private watchMember = (memberID: string): void => {
		this.memberChanged.next();
		this.member = { id: memberID };
		this.membersService.watchMember(this.team, memberID)
			.subscribe({
					next: result => {
						this.member = result.member;
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
			memberIDs: this.member?.id ? [this.member.id] : undefined,
		};
		const request: ICreateDocumentRequest = {
			teamID: this.team.id,
			memberID: this?.member?.id,
			dto,
		};

		this.documentService.createDocument(request)
			.subscribe({
				next: this.onDocCreated,
				error: (err: any) => {
					this.errorLogger.logError(err, 'Failed to create new document');
				},
			});
	}

	private onDocCreated = (doc: IDocumentContext): void => {
		this.teamNavService
			.navigateForwardToTeamPage(this.team, 'document/' + doc.id)
			.catch(this.errorLogger.logErrorHandler('Failed to navigate to document page'));
	};
}
