import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ViewDidEnter, ViewDidLeave, ViewWillEnter } from '@ionic/angular';
import { getStoreId, IProjectContext } from '@sneat/datatug-nav';

// const paramTab = 'tab';
const tabs = ['active', 'bookmarked', 'personal', 'shared'] as const;
type Tab = (typeof tabs)[number];

const paramOrderTagsBy = 'order-tags-by';
const orderBys = ['count', 'title'];
type OrderBy = (typeof orderBys)[number];

@Component({
	selector: 'sneat-datatug-sql-queries',
	templateUrl: './queries-page.component.html',
	styleUrls: ['./queries-page.component.scss'],
})
export class QueriesPageComponent
	implements OnInit, ViewWillEnter, ViewDidEnter, ViewDidLeave
{
	@ViewChild('codemirrorComponent', { static: true })
	public codemirrorComponent?: CodemirrorComponent;

	public isActiveView = false;

	// noinspection SqlDialectInspection
	public sql = 'select * from ';

	public tab: Tab = 'shared';
	public orderTagsBy: OrderBy = 'count';

	public filter = '';

	public project?: IProjectContext;

	public get defaultBackHref(): string {
		return this.project
			? `/store/${getStoreId(this.project.ref.storeId)}/project/${
					this.project.ref.projectId
				}`
			: '/';
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
	) {
		this.route.queryParamMap.subscribe((q) => {
			const tab = q.get('tab') as Tab;
			if (!tab) {
				this.updateUrlWithCurrentTab();
			} else if (tab !== this.tab && tabs.includes(tab)) {
				this.tab = tab;
			}

			const orderBy = q.get(paramOrderTagsBy) as OrderBy;
			if (!orderBy) {
				this.updateUrlWithOrderTagsBy();
			} else if (orderBy != this.orderTagsBy && orderBys.includes(orderBy)) {
				this.orderTagsBy = orderBy;
			}
		});
	}

	public updateUrlWithOrderTagsBy(): void {
		this.setUrlParam(paramOrderTagsBy, this.orderTagsBy);
	}

	public updateUrlWithCurrentTab(): void {
		this.setUrlParam('tab', this.tab);
	}

	public setUrlParam(name: string, value: string): void {
		const queryParams: Params = { [name]: value };
		this.router
			.navigate([], {
				relativeTo: this.route,
				queryParams: queryParams,
				queryParamsHandling: 'merge', // remove to replace all query params by provided
			})
			.catch(
				this.errorLogger.logErrorHandler(
					`failed to update url with query parameter "${name}"`,
				),
			);
	}

	ionViewWillEnter(): void {
		console.log('ionViewWillEnter()');
		this.isActiveView = true;
	}

	ionViewDidEnter(): void {
		console.log('ionViewDidEnter()');
	}

	ionViewDidLeave(): void {
		console.log('ionViewDidLeave()');
		this.isActiveView = false;
	}

	ngOnInit(): void {
		console.log('QueriesPage.ngOnInit()');
	}

	reloadQueries(): void {
		// this.loadQueries();
	}
}
