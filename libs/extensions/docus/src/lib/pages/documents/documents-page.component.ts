import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDocumentAssetDto } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import {
	TeamPageBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team/components';
import { IAssetContext, IMemberContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-documents-page',
	templateUrl: './documents-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class DocumentsPageComponent extends TeamPageBaseComponent {
	public segment: 'type' | 'owner' | 'list' = 'type';

	public documents: IAssetContext<IDocumentAssetDto>[];
	public rootDocs?: IAssetContext<IDocumentAssetDto>[];
	filter = '';

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private assetService: AssetService,
	) {
		super('DocumentsPageComponent', route, params);
		this.documents = window.history.state
			.documents as IAssetContext<IDocumentAssetDto>[];
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		this.loadDocuments();
	}

	loadDocuments() {
		console.log('DocumentsPage.loadDocuments()');
		if (this.team?.id) {
			this.assetService
				.watchTeamAssets(this.team)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: (documents) => {
						this.documents = documents;
					},
				});
		}
	}

	public goType(type: string) {
		console.log(`goType(${type})`);
	}

	public goDoc(doc: IAssetContext<IDocumentAssetDto>) {
		if (!this.team) {
			this.errorLogger.logError(
				'not able to navigate to document without team context',
			);
			return;
		}
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, `document/${doc.id}`, {
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
		const team = this.team;
		if (team) {
			this.teamNav
				.navigateForwardToTeamPage(team, 'new-document', {
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
		this.filter = filter;
		// this.contacts = !filter && !role
		//     ? this.allContacts
		//     : this.allContacts.filter(c =>
		//         (!filter || c.title.toLowerCase().indexOf(filter) >= 0)
		//         && (!role || c.roles && c.roles.includes(role))
		//     );
	}
}
