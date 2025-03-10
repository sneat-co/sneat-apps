import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FilterItemComponent } from '@sneat/components';
import { IMemberContext } from '@sneat/contactus-core';
import { ContactusServicesModule } from '@sneat/contactus-services';
import {
	AssetService,
	AssetusServicesModule,
} from '@sneat/extensions/assetus/components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
	SpaceCoreComponentsModule,
} from '@sneat/team-components';
import {
	IAssetContext,
	IAssetDocumentContext,
	IAssetDocumentExtra,
} from '@sneat/mod-assetus-core';
import { DocumentsByTypeComponent } from './components/documents-by-type/documents-by-type.component';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';

@Component({
	selector: 'sneat-documents-page',
	templateUrl: './documents-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		IonicModule,
		DocumentsListComponent,
		FilterItemComponent,
		DocumentsByTypeComponent,
		FormsModule,
		SpaceCoreComponentsModule,
		ContactusServicesModule,
		AssetusServicesModule,
	],
})
export class DocumentsPageComponent extends SpaceBaseComponent {
	public segment: 'type' | 'owner' | 'list' = 'type';

	public documents: IAssetDocumentContext[];
	public rootDocs?: IAssetDocumentContext[];
	filter = '';

	constructor(
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		private assetService: AssetService,
	) {
		super('DocumentsPageComponent', route, params);
		this.documents = window.history.state.documents as IAssetContext<
			'document',
			IAssetDocumentExtra
		>[];
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		this.loadDocuments();
	}

	loadDocuments() {
		console.log('DocumentsPage.loadDocuments()');
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
		console.log(`goType(${type})`);
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
		this.filter = filter;
		// this.contacts = !filter && !role
		//     ? this.allContacts
		//     : this.allContacts.filter(c =>
		//         (!filter || c.title.toLowerCase().includes(filter))
		//         && (!role || c.roles && c.roles.includes(role))
		//     );
	}
}
