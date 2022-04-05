import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDocumentContext, IDocumentDto } from '@sneat/dto';
import { AssetService } from '@sneat/extensions/assetus/components';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IAssetContext, IMemberContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-documents-page',
	templateUrl: './documents-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class DocumentsPageComponent extends TeamBaseComponent {

	public segment: 'type' | 'owner' | 'list' = 'type';

	public documents: IDocumentContext[];
	public rootDocs?: IDocumentContext[];
	filter = '';

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private assetService: AssetService,
	) {
		super('DocumentsPageComponent', route, params);
		this.documents = window.history.state.documents as IDocumentContext[];
	}

	loadDocuments() {
		console.log('DocumentsPage.loadDocuments()');
		if (this.team?.id) {
			this.assetService.watchAssetsByTeamID<IDocumentDto, IDocumentContext>(this.team?.id)
				.pipe(
					this.takeUntilNeeded(),
				)
				.subscribe(documents => {
						documents = documents.filter(a => a.brief?.type === 'document');
						if (documents && (!this.documents || this.documents.length !== documents.length)) { // TODO: deep equal
							this.documents = documents;
							this.rootDocs = documents.filter(d => !d.dto?.parentAssetID);
						}
					},
				);
		}
	}

	public goType(type: string) {
		console.log(`goType(${type})`);
	}

	public goDoc(asset: IAssetContext) {
		if (!this.team) {
			this.errorLogger.logError('not able to navigate to document without team context');
			return;
		}
		this.teamParams.teamNavService.navigateForwardToTeamPage(
			this.team, `document/${asset.id}`,
			{ state: { asset } })
			.catch(this.errorLogger.logError);
	}

	goNewDoc = (type?: string, member?: IMemberContext) => {
		const queryParams: { type?: string, member?: string } = type ? { type } : {};
		if (member) {
			queryParams['member'] = member.id;
		}
		const state = member ? { member } : undefined;
		// this.navigateForward('new-document', queryParams, state);
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
